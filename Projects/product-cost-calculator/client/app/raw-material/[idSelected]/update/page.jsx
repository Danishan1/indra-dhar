"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.rawMaterial}
      basePath={BASE_PATH.rawMaterial}
      title="Raw Material"
      fields={[
        { key: "name", label: "Raw Material Name", type: FORM_TYPE.TEXT },
        { key: "unit_type", label: "Unit of Measure", type: FORM_TYPE.TEXT },
        { key: "unit_price", label: "Material Rate", type: FORM_TYPE.TEXT },
        { key: "gst", label: "GST", type: FORM_TYPE.TEXT },
      ]}
    />
  );
}
