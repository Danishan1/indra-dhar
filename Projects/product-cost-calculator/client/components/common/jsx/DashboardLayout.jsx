"use client";
import styles from "../css/DashboardLayout.module.css";
import { ProtectedPage } from "./ProtectedPage";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function DashboardLayout({ children, tabs, showBack }) {
  return (
    <ProtectedPage>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          {tabs && (
            <div className={styles.topNavBar}>
              <TopNavbar tabs={tabs} showBack={showBack} />
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </ProtectedPage>
  );
}
