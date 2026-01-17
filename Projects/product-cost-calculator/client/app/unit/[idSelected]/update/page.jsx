"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.unit}
      basePath={BASE_PATH.unit}
      title="Unit of Measure"
      fields={[
        {
          key: "unit_code",
          title: "Unit Code",
          type: FORM_TYPE.TEXT,
        },
        {
          key: "name",
          label: "Unit Name",
          type: FORM_TYPE.TEXT,
        },
        // {
        //   key: "base_unit",
        //   title: "Base Unit",
        //   type: FORM_TYPE.TEXT,
        // },
        {
          key: "decimal_allowed",
          title: "Decimal Allowed",
          type: FORM_TYPE.SWITCH,
        },
      ]}
    />
  );
}
