"use client";
import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.utilities;

  const config = [];

  return (
    <CrudLayout basePath={basePath} title="Unauthorized Access" config={config}>
      {children}
    </CrudLayout>
  );
}
