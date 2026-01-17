"use client";

import { CrudFormPage } from "@/components/layout";
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  const unitOptions = useFetchOptions({
    endpoint: BASE_PATH.unit,
    label: "unit_code",
  });

  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.rawMaterial}
      basePath={BASE_PATH.rawMaterial}
      title="Raw Material"
      fields={[
        {
          key: "name",
          label: "Raw Material Name",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "unit_type_id",
          label: "Unit of Measure",
          type: FORM_TYPE.SELECT,
          required: true,
          options: unitOptions,
        },
        {
          key: "unit_price",
          label: "Material Rate",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "is_gst_itc",
          label: "Is GST Input Available",
          type: FORM_TYPE.SWITCH,
          required: true,
        },
        {
          key: "gst",
          label: "GST % (if applicable)",
          type: FORM_TYPE.TEXT,
        },
      ]}
    />
  );
}
