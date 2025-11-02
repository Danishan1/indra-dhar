"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  const options = useFetchOptions({ endpoint: BASE_PATH.products });
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.batches}
      basePath={BASE_PATH.batches}
      title="Batch"
      fields={[
        {
          key: "product_id",
          label: "Product Name",
          type: FORM_TYPE.SELECT,
          options: options,
        },
        { key: "batch_size", label: "Batch Size", type: FORM_TYPE.TEXT },
        { key: "start_date", label: "Start Date", type: FORM_TYPE.TEXT },
        { key: "end_date", label: "End Date", type: FORM_TYPE.TEXT },
        {
          key: "status",
          label: "Status",
          type: FORM_TYPE.RADIO,
          options: statusOptions,
        },
        { key: "remarks", label: "Remarks", type: FORM_TYPE.TEXTAREA },
      ]}
    />
  );
}
