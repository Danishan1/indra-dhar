"use client";
import styles from "../css/DashboardLayout.module.css";
import ProtectedPage from "./ProtectedPage";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }) {
  return (
    <ProtectedPage>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedPage>
  );
}
