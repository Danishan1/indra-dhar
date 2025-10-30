"use client";
import { CrudLayout } from "@/components/common";

export default function UsersLayout({ children }) {
  const basePath = "/users";
  const config = [
    { label: "Create User", path: "create" },
    { label: "Users", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
    { label: "Change Password", path: "[id]/update-password" },
  ];

  return (
    <CrudLayout basePath={basePath} title="User Management" config={config}>
      {children}
    </CrudLayout>
  );
}
