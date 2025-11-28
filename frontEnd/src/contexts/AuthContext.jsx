import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios"; // ✅ Ensure this matches your project structure

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          // 1. Call the NEW endpoint to get fresh Role/Status
          const response = await api.get("/me"); // <--- THE FIX
          
          const freshUserData = response.data;
          const localUserData = JSON.parse(storedUser);

          // 2. Merge the local token with the FRESH database info
          const mergedUser = { 
            ...localUserData, // Keep token
            ...freshUserData  // Overwrite role, enabled, etc.
          };

          // 3. Update LocalStorage so the browser remembers the new Role
          localStorage.setItem("user", JSON.stringify(mergedUser));

          setAuth({
            isAuthenticated: true,
            user: mergedUser,
            loading: false,
          });
        } catch (e) {
          console.error("Auth Sync Failed:", e);
          // If 401/403, the token is invalid -> Log out
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuth({ isAuthenticated: false, user: null, loading: false });
        }
      } else {
        setAuth({ isAuthenticated: false, user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post("/auth/login", {
        usernameOrEmail,
        password,
      });

      const { accessToken, ...userData } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setAuth({
        isAuthenticated: true,
        user: userData,
        loading: false,
      });

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ isAuthenticated: false, user: null, loading: false });
    window.location.href = '/auth/login'; 
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {!auth.loading ? children : <div className="h-screen flex items-center justify-center">Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);