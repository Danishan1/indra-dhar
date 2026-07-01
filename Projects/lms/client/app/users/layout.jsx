"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.users;

  const config = [
    { label: "Create New User", path: "create" },
    { label: "Users", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
  ];

  return (
    <CrudLayout basePath={basePath} title="User Management" config={config}>
      {children}
    </CrudLayout>
  );
}
