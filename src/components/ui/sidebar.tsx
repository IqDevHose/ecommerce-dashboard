import { useState } from "react";
import { Nav } from "./nav";
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
  ListCheck,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./button";
import { Navigate } from "react-router-dom";

type Props = {};

export default function Sidebar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove the token
    Navigate("/login"); // Redirect to login
  };
  return (
    <div className="h-screen border-r md:w-2/12 ">
      {/* Hamburger Button */}
      <button
        className="md:hidden p-4 focus:outline-none pt-11 "
        onClick={toggleMenu}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Big screen */}
      <div
        className={`sticky top-0  hidden md:block pb-10 pt-24 h-screen transition-all duration-300`}
      >
        <Nav
          links={[
            {
              title: "Dashboard",
              href: "/",
              icon: LayoutDashboard,
              variant: "default",
            },
            {
              title: "Users",
              href: "/users",
              icon: UsersRound,
              variant: "ghost",
            },
            {
              title: "Products",
              href: "/products",
              icon: ShoppingCart,
              variant: "ghost",
            },
            {
              title: "Orders",
              href: "/orders",
              icon: ListCheck,
              variant: "ghost",
            },
            {
              title: "Settings",
              href: "/settings",
              icon: Settings,
              variant: "ghost",
            },
          ]}
        />
      </div>

      {/* Small Screens */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md h-screen w-40 overflow-y-auto">
          <Nav
            links={[
              {
                title: "Dashboard",
                href: "/",
                icon: LayoutDashboard,
                variant: "default",
              },
              {
                title: "Users",
                href: "/users",
                icon: UsersRound,
                variant: "ghost",
              },
              {
                title: "Products",
                href: "/products",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Orders",
                href: "/orders",
                icon: ListCheck,
                variant: "ghost",
              },
              {
                title: "Settings",
                href: "/settings",
                icon: Settings,
                variant: "ghost",
              },
            ]}
          />
        </div>
      )}
       <div className="sidebar">
      {/* Your sidebar links */}
      <Button onClick={handleLogout} variant="outline" className="mt-4">
        Logout
      </Button>
    </div>
    </div>
  );
}
