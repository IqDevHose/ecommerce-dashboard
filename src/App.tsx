import { Route, Routes } from "react-router-dom";

import Sidebar from "../src/components/ui/sidebar"; // Ensure Sidebar is correctly imported
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";

import ProductsPage from "./pages/products/Products";
import OrdersPage from "./pages/orders/Orders";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
