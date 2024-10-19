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
  LogOut,
  Hammer,
  FolderTree,
} from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function Sidebar({ }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <>
      {/* Burger menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-full md:w-64 bg-white shadow-md transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex-grow">
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
                  title: "Categories",
                  href: "/categories",
                  icon: FolderTree,
                  variant: "ghost",
                },
                {
                  title: "Auctions",
                  href: "/auctions",
                  icon: Hammer,
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
          <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center">
            <span className="mr-2">
              <LogOut size={16} />
            </span>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
