"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  const options = [
    { value: "Per Hour", label: "Per Hour" },
    { value: "Per Process", label: "Per Process" },
    // { value: "Salary", label: "Salary" },
  ];

  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.labors}
      basePath={BASE_PATH.labors}
      title="Labor"
      fields={[
        {
          key: "name",
          label: "Labor Name",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "labor_type",
          label: "Type",
          type: FORM_TYPE.RADIO,
          options: options,
          required: true,
        },
        {
          key: "rate_per_hour",
          label: "Rate/Salary",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        { key: "overtime_rate", label: "Over Time Rate", type: FORM_TYPE.TEXT },
        { key: "remark", label: "Remark", type: FORM_TYPE.TEXTAREA },
      ]}
    />
  );
}
