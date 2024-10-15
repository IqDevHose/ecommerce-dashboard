import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./ui/sidebar";

// Placeholder function to check authentication
const isAuthenticated = (): boolean => {
  // Implement your actual authentication logic here
  // For example, check if a token exists in localStorage
  return !!localStorage.getItem("jwtToken");
};



const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
