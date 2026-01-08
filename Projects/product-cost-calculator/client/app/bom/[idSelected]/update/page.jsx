"use client";

import { CrudFormPage, CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
import { useParams } from "next/navigation";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  const { idSelected } = useParams();

  return (
    // <CrudFormPage
    //   mode="update"
    //   endpoint={BASE_PATH.bom}
    //   basePath={BASE_PATH.bom}
    //   title="BOM"
    //   fields={[
    //     { key: "name", label: "BOM Name", type: FORM_TYPE.TEXT },
    //   ]}
    // />

    <CrudListPage
      endpoint={`${BASE_PATH.bomItem}/bom/${idSelected}`}
      basePath={BASE_PATH.bom}
      columns={[
        { key: "material_name", title: "Material Name" },
        { key: "decimal_allowed", title: "Decimal Allowed" },
        { key: "quantity", title: "Quantity" },
        { key: "material_unit_price", title: "Unit Price" },
        { key: "material_is_gst_itc", title: "GST ITC" },
        { key: "material_gst", title: "GST %" },
      ]}
    />
  );
}
