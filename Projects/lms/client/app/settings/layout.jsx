"use client";

import { DashboardLayout } from "@/components/common";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.leads;

  const config = [
    { label: "Create New Lead", path: "create" },
    { label: "Leads", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
  ];

  return (
    <DashboardLayout
      basePath={basePath}
      title="Lead Management"
      config={config}
    >
      {children}
    </DashboardLayout>
  );
}
