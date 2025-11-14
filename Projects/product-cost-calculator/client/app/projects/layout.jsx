"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.products;

  const config = [];

  return (
    <CrudLayout basePath={basePath} title="New project" config={config}>
      {children}
    </CrudLayout>
  );
}
