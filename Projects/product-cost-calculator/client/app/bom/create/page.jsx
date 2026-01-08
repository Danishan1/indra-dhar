"use client";

import { CrudFormPage } from "@/components/layout";
// import { useFetchOptions } from "@/hooks/useFetchOptions";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  // const vendorOptions = useFetchOptions({ endpoint: BASE_PATH.vendors });

  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.bom}
      basePath={BASE_PATH.bom}
      title="BOM"
      fields={[
        {
          key: "name",
          label: "BOM Name",
          type: FORM_TYPE.TEXT,
          required: true,
        },
      ]}
    />
  );
}
