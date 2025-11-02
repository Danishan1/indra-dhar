"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.rawMaterial;

  const config = [
    { label: "Create New Raw Material", path: "create" },
    { label: "Raw Materials", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
  ];

  return (
    <CrudLayout basePath={basePath} title="Raw Material Management" config={config}>
      {children}
    </CrudLayout>
  );
}
