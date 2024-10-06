import { Nav } from "./nav";
import {
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
  ListCheck,
} from "lucide-react";

type Props = {};

export default function Sidebar({}: Props) {

  return (
    <div
      className={`sticky top-0 border-r hidden md:block w-0 md:w-3/12 pb-10 pt-24 h-screen transition-all duration-300 `}
    >
      <Nav
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
            title: "Products",
            href: "/products", // Adjust routing accordingly
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Orders",
            href: "/orders", // Adjust routing accordingly
            icon: ListCheck,
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
