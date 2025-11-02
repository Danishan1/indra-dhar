"use client";

import { CrudFormPage } from "@/components/layout";
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  const vendorOptions = useFetchOptions({ endpoint: BASE_PATH.vendors });

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
          key: "unit_type",
          label: "Unit Type",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "unit_price",
          label: "Unit Price",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "stock_quantity",
          label: "Stock Quantity",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        { key: "reorder_level", label: "Reorder Level", type: FORM_TYPE.TEXT },
        {
          key: "vendor_id",
          label: "Vendor Name",
          type: FORM_TYPE.SELECT,
          required: true,
          options: vendorOptions,
        },
      ]}
    />
  );
}
