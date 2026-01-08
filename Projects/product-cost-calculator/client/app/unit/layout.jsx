"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.unit;

  const config = [
    { label: "Create New Unit of Martials", path: "create" },
    { label: "Unit of Martials", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
  ];

  return (
    <CrudLayout basePath={basePath} title="Unit of Measure Management" config={config}>
      {children}
    </CrudLayout>
  );
}
