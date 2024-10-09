// src/App.tsx

import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "@/components/ui/sidebar"; // Ensure Sidebar is correctly imported
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import ProductsPage from "./pages/products/Products";
import OrdersPage from "./pages/orders/Orders";
import Settings from "./pages/settings/Settings";
import AddProduct from "./pages/products/AddProduct";
import AddOrder from "./pages/orders/AddOrder";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";

import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import EditProduct from "./pages/products/EditProdect";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

// Layout component to include Sidebar for authenticated routes
const Layout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/new-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/new-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/new-order" element={<AddOrder />} />

        <Route path="/settings" element={<Settings />} />

        {/* Optional: Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> {/* Register route */}
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login if not authenticated */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
