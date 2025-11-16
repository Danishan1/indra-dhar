"use client";

import { CrudLayout } from "@/components/common/jsx/CrudLayout";
import { BASE_PATH } from "@/utils/basePath";

export default function Layout({ children }) {
  const basePath = BASE_PATH.bulkUpload;

  const config = [];

  return (
    <CrudLayout basePath={basePath} title="Bulk Upload" config={config}>
      {children}
    </CrudLayout>
  );
}
