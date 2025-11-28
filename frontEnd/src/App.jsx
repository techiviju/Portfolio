import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Components
import GlobalNavbar from "./pages/GlobalNavbar";

// Pages
import HomePage from "./pages/HomePage";
import PublicPortfolio from "./pages/PublicPortfolio";
import LoginPage from "./pages/LoginPage";
import RequestAccountPage from "./pages/RequestAccountPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import SuperAdminPage from "./pages/SuperAdminPage";

function App() {
  return (
    <AuthProvider>
      <GlobalNavbar />
      <div className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/u/:username" element={<PublicPortfolio />} />
          <Route path="/request-account" element={<RequestAccountPage />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/activate" element={<ActivateAccountPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Super Admin Route Placeholder */}
          {/* Super Admin Route */}
          <Route path="/super-admin" element={<SuperAdminPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
