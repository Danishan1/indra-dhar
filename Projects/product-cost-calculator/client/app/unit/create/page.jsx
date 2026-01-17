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
      endpoint={BASE_PATH.unit}
      basePath={BASE_PATH.unit}
      title="Unit of Measure"
      fields={[
        {
          key: "name",
          label: "Unit Name",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        {
          key: "unit_code",
          label: "Unit Code",
          type: FORM_TYPE.TEXT,
          required: true,
        },
        // {
        //   key: "base_unit",
        //   label: "Base Unit",
        //   type: FORM_TYPE.TEXT,
        //   required: true,
        // },
        {
          key: "decimal_allowed",
          label: "Decimal Allowed",
          type: FORM_TYPE.SWITCH,
          required: true,
        },
      ]}
    />
  );
}
