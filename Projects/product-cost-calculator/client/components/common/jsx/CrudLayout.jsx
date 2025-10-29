"use client";
import { createContext, useContext, useState } from "react";
import { DashboardLayout } from "./DashboardLayout";

/**
 * Generic CRUD Layout
 * - Wraps module pages (users, projects, costs, etc.)
 * - Manages selected item ID & tab navigation
 *
 * Props:
 *  - basePath: string (e.g., "/users")
 *  - title: string (e.g., "User Management")
 *  - children: ReactNode
 *  - config: array of tab objects like:
 *      [
 *        { label: "Create", path: "create" },
 *        { label: "List", path: "get-list" },
 *        { label: "View", path: "[id]/get" },
 *        { label: "Update", path: "[id]/update" },
 *      ]
 */

const CrudContext = createContext();
export const useCrud = () => useContext(CrudContext);

export function CrudLayout({ basePath, title, config, children }) {
  const [selectedId, setSelectedId] = useState(null);

  // dynamically map tab paths
  const tabs = config
    .map((tab) => {
      // tabs with dynamic id only show when selectedId exists
      if (tab.path.includes("[id]") && !selectedId) return null;

      const resolvedPath = tab.path.replace("[id]", selectedId || "");
      return { label: tab.label, path: `${basePath}/${resolvedPath}` };
    })
    .filter(Boolean);

  return (
    <CrudContext.Provider value={{ selectedId, setSelectedId }}>
      <DashboardLayout tabs={tabs} showBack title={title}>
        {children}
      </DashboardLayout>
    </CrudContext.Provider>
  );
}
