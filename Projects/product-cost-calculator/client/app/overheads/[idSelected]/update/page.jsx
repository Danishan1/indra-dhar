"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  const typeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "percentage", label: "Percentage" },
  ];
  const freOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
    { value: "per_batch", label: "Per Batch" },
  ];

  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.overheads}
      basePath={BASE_PATH.overheads}
      title="Overhead"
      fields={[
        { key: "name", label: "Overhead Name", type: FORM_TYPE.TEXT },
        {
          key: "type",
          label: "Type",
          type: FORM_TYPE.RADIO,
          options: typeOptions,
        },
        { key: "value", label: "Value", type: FORM_TYPE.TEXT },
        {
          key: "frequency",
          label: "Frequency",
          type: FORM_TYPE.RADIO,
          options: freOptions,
        },
        { key: "is_global", label: "Is Global", type: FORM_TYPE.SWITCH },
      ]}
    />
  );
}
