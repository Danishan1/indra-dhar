"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

import styles from "../css/Sidebar.module.css";
import menuItems from "../helper/sidebar";
import { Menu } from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const { open, toggleSidebar } = useSidebar();

  const pathname = usePathname();
  const router = useRouter();

  const sidebarPath = `/${pathname.split("/")[1]}`;

  const items = menuItems[user?.role?.name || "user"] || [];

  const [expanded, setExpanded] = useState(null);

  return (
    <>
      {!open && (
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      )}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div>
          <div className={styles.titleHeader}>
            <div className={styles.logo}>CostCalc</div>

            <button className={styles.closeBtn} onClick={toggleSidebar}>
              <X size={22} />
            </button>
          </div>

          <nav className={styles.menu}>
            {items.map((item) => {
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.name}>
                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      if (hasChildren) {
                        setExpanded((prev) =>
                          prev === item.name ? null : item.name,
                        );
                      } else if (item.path) {
                        router.push(item.path);
                        toggleSidebar();
                      }
                    }}
                  >
                    <div className={styles.menuLeft}>
                      {item.icon}
                      <span>{item.name}</span>
                    </div>

                    {hasChildren &&
                      (expanded === item.name ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      ))}
                  </button>

                  {hasChildren && expanded === item.name && (
                    <div className={styles.subMenu}>
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => {
                            router.push(child.path);
                            toggleSidebar();
                          }}
                          className={`${styles.subMenuItem} ${
                            sidebarPath === child.path ? styles.active : ""
                          }`}
                        >
                          {child.icon}
                          <span>{child.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

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
    </>
  );
}
