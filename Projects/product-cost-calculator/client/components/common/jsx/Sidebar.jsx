"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "../css/Sidebar.module.css";
import menuItems from "../helper/sidebar";

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const sidebarPath = `/${pathname.split("/")[1]}`;
  const router = useRouter();

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
