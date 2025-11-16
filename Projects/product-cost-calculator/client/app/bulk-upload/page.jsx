"use client";

import { BulkUpload } from "@/components/common/jsx/BulkUpload";
import { useRole } from "@/hooks/useRole";
import { BASE_PATH } from "@/utils/basePath";
import React from "react";

export default function BulkUploadPage() {
  const { isAdmin } = useRole();
  const uploadOptions = [
    { value: `${BASE_PATH.labors}/bulk`, label: "Labors" },
    { value: `${BASE_PATH.machines}/bulk`, label: "Machines" },
    { value: `${BASE_PATH.rawMaterial}/bulk`, label: "Raw Materials" },
    { value: `${BASE_PATH.utilities}/bulk`, label: "Utilities" },
    { value: `${BASE_PATH.overheads}/bulk`, label: "Overheads" },
    isAdmin && { value: `${BASE_PATH.users}/bulk`, label: "Users" },
  ].filter(Boolean);

  return (
    <div style={{ padding: "2rem" }}>
      <BulkUpload uploadOptions={uploadOptions} />
    </div>
  );
}
