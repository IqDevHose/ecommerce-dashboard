import React from "react";
import { Nav } from "./nav";
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { Button } from "./button";
import { useWindowWidth } from "@react-hook/window-size";

type Props = {};

export default function Sidebar({}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div
      className={`sticky top-0 border-r px-3 pb-10 pt-24 h-screen transition-all duration-300 `}
    >
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            variant="secondary"
            className="rounded-full p-2"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/", // You might need to replace this with React Router's Link if you are using it
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Users",
            href: "/users", // React Router's Link may be needed here
            icon: UsersRound,
            variant: "ghost",
          },
          {
            title: "Orders",
            href: "/orders", // Adjust routing accordingly
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/settings", // Adjust if necessary
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
