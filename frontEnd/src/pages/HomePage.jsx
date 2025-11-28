import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // 1. Import Auth Context

const HomePage = () => {
  // 2. Get authentication state and user details
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg text-white p-4">
      <h1 className="text-5xl font-bold mb-4">
        Welcome to the Portfolio Platform
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Create and share your own professional portfolio.
      </p>

      <div className="flex gap-4 mb-12">
        <Link
          to="/request-account"
          // Kept the working gradient class
          className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-green text-black font-bold rounded-lg hover:shadow-neon transition-all"
        >
          Request an Account
        </Link>

        {/* Optional: Toggle this button text based on auth state */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/auth/login"}
          className="px-6 py-3 glass text-white rounded-lg hover:bg-white/10 transition-all"
        >
          {isAuthenticated ? "Go to Dashboard" : "Admin/User Login"}
        </Link>
      </div>

      {/* 3. Dynamic Footer Link Logic */}
      <div className="text-center border-t border-gray-800 pt-8 w-full max-w-md">
        <p className="text-gray-500 mb-2">
          {isAuthenticated
            ? "View Your Portfolio:"
            : "View Developer Portfolio:"}
        </p>

        <Link
          to={
            isAuthenticated && user?.username
              ? `/u/${user.username}`
              : "/u/developer"
          }
          className="text-neon-green hover:text-neon-blue transition-colors text-xl font-mono hover:underline"
        >
          {isAuthenticated && user?.username
            ? `/u/${user.username}`
            : "/u/developer"}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
