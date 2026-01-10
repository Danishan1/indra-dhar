"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.projects;

  const config = [
    { label: "New Product", path: "/" },
    { label: "All Products", path: "get-list" },
    { label: "View", path: "[id]/get" },
  ];

  return (
    <CrudLayout basePath={basePath} title="New project" config={config}>
      {children}
    </CrudLayout>
  );
}
