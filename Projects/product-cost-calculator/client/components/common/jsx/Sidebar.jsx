"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../css/Sidebar.module.css";
import {
  Home,
  Users,
  Layers,
  Package,
  Share2,
  Calculator,
  Settings,
} from "lucide-react";
import { CONST } from "@/utils/CONST";

const { ICON_SIZE } = CONST;

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const sidebarPath = `/${pathname.split("/")[1]}`;
  const router = useRouter();

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        icon: <Home size={ICON_SIZE} />,
        path: "/dashboard",
      },
      {
        name: "Users",
        icon: <Users size={ICON_SIZE} />,
        path: "/users",
      },
      {
        name: "Cost Category",
        icon: <Layers size={ICON_SIZE} />,
        path: "/cost-category",
      },
      {
        name: "Cost Items",
        icon: <Package size={ICON_SIZE} />,
        path: "/cost-items",
      },
      {
        name: "Cost Allocation",
        icon: <Share2 size={ICON_SIZE} />,
        path: "/cost-allocation",
      },
      {
        name: "Cost Calculator",
        icon: <Calculator size={ICON_SIZE} />,
        path: "/costing",
      },
      {
        name: "Settings",
        icon: <Settings size={ICON_SIZE} />,
        path: "/settings",
      },
    ],
    manager: [
      {
        name: "Dashboard",
        icon: <Home size={ICON_SIZE} />,
        path: "/dashboard",
      },
      {
        name: "Users",
        icon: <Users size={ICON_SIZE} />,
        path: "/users",
      },
      {
        name: "Cost Category",
        icon: <Layers size={ICON_SIZE} />,
        path: "/cost-category",
      },
      {
        name: "Cost Items",
        icon: <Package size={ICON_SIZE} />,
        path: "/cost-items",
      },
      {
        name: "Cost Allocation",
        icon: <Share2 size={ICON_SIZE} />,
        path: "/cost-allocation",
      },
      {
        name: "Cost Calculator",
        icon: <Calculator size={ICON_SIZE} />,
        path: "/costing",
      },
    ],
    user: [
      {
        name: "Dashboard",
        icon: <Home size={ICON_SIZE} />,
        path: "/dashboard",
      },
      {
        name: "Cost Calculator",
        icon: <Calculator size={ICON_SIZE} />,
        path: "/costing",
      },
    ],
  };

  const items = menuItems[user?.role || "user"];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>CostCalc</div>

      <nav className={styles.menu}>
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`${styles.menuItem} ${
              sidebarPath === item.path ? styles.active : ""
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
