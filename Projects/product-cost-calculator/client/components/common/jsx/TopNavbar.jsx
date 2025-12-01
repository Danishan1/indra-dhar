"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import styles from "../css/TopNavbar.module.css";
import { useSidebar } from "@/context/SidebarContext";

/**
 * TopNavbar — horizontal tab navigation
 * Props:
 * - tabs: [{ label, path }]
 * - showBack: boolean
 * - onBack: function
 */
export function TopNavbar({ tabs = [], showBack = false, onBack }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
        <Menu size={22} />
      </button>
      <div className={styles.leftSection}>
        {showBack && (
          <button className={styles.backButton} onClick={handleBack}>
            <ArrowLeft size={18} />
          </button>
        )}

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.path}
              className={`${styles.tab} ${
                pathname === tab.path ? styles.active : ""
              }`}
              onClick={() => router.push(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
