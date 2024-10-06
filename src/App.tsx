import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import Orders from "../src/pages/Orders";
import Settings from "../src/pages/Settings"; // Ensure Settings is imported
import Users from "../src/pages/Users"; // Ensure Users is imported
import Products from "../src/pages/Products"; // Ensure Users is imported
import Sidebar from "../src/components/ui/sidebar"; // Ensure Sidebar is correctly imported

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
