// src/App.tsx

import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import ProductsPage from "./pages/products/Products";
import OrdersPage from "./pages/orders/Orders";
import Settings from "./pages/settings/Settings";
import AddProduct from "./pages/products/AddProduct";
import AddOrder from "./pages/orders/AddOrder";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import Auctions from "./pages/auctions/Auctions";
import AddAuction from "./pages/auctions/AddAuction";
import EditAuction from "./pages/auctions/EditAuction";

import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import EditProduct from "./pages/products/EditProduct";
import Categories from "./pages/categories/Categories";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";



function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected Routes */}
      <Route
        element={<ProtectedRoute />}
      >
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

        <Route path="/auctions" element={<Auctions />} />
        <Route path="/new-auction" element={<AddAuction />} />
        <Route path="/edit-auction/:id" element={<EditAuction />} />

        {/* New category routes */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/new-category" element={<AddCategory />} />
        <Route path="/edit-category/:id" element={<EditCategory />} />

      </Route>


      {/* Optional: Catch-all route for unmatched paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
