"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../css/Sidebar.module.css";
import { Home, Calculator, Package, Settings } from "lucide-react";
import { CONST } from "@/utils/CONST";

const { ICON_SIZE } = CONST;

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        icon: <Home size={ICON_SIZE} />,
        path: "/dashboard",
      },
      {
        name: "Projects",
        icon: <Package size={ICON_SIZE} />,
        path: "/projects",
      },
      {
        name: "Costing",
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
        name: "Projects",
        icon: <Package size={ICON_SIZE} />,
        path: "/projects",
      },
      {
        name: "Costing",
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
        name: "My Costing",
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
              pathname === item.path ? styles.active : ""
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
