"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.indirectExpense;

  const config = [
    { label: "Create New Indirect Expense", path: "create" },
    { label: "Indirect Expenses", path: "get-list" },
    { label: "View", path: "[id]/get" },
    { label: "Update", path: "[id]/update" },
    { label: "Delete", path: "[id]/delete" },
  ];

  return (
    <CrudLayout basePath={basePath} title="Indirect Expense Management" config={config}>
      {children}
    </CrudLayout>
  );
}
