import React from "react";
import { Navigate } from "react-router-dom";

// Placeholder function to check authentication
const isAuthenticated = (): boolean => {
  // Implement your actual authentication logic here
  // For example, check if a token exists in localStorage
  return !!localStorage.getItem("jwtToken");
};

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
