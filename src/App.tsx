import { Route, Routes } from "react-router-dom";

import Sidebar from "../src/components/ui/sidebar"; // Ensure Sidebar is correctly imported
import Home from "./pages/home/Home";
import Users from "./pages/users/Users";

import ProductsPage from "./pages/products/Products";
import OrdersPage from "./pages/orders/Orders";
import Settings from "./pages/settings/Settings";
import AddProduct from "./pages/products/AddProduct";
import AddOrder from "./pages/orders/AddOrder";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/new-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />


        <Route path="/products" element={<ProductsPage />} />
        <Route path="/new-product" element={<AddProduct />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/new-order" element={<AddOrder />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
