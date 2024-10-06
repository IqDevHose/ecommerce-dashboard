import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import Orders from "../src/pages/Orders";
import Settings from "../src/pages/Settings"; // Ensure Settings is imported
import Users from "../src/pages/Users"; // Ensure Users is imported
import Sidebar from "../src/components/ui/sidebar"; // Ensure Sidebar is correctly imported

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
