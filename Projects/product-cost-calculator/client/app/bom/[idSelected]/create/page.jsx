"use client";

import { CrudFormPage } from "@/components/layout";
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
import { useParams } from "next/navigation";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  const materialOptions = useFetchOptions({ endpoint: BASE_PATH.rawMaterial });
  const { idSelected } = useParams();

  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.bomItem}
      basePath={BASE_PATH.bom + `/${idSelected}/update`}
      title="BOM Item"
      fields={[
        {
          key: "bom_meta_id",
          label: "BOM Id",
          type: FORM_TYPE.TEXT,
          required: true,
          disabled: true,
          value: idSelected,
        },
        {
          key: "material_id",
          label: "Material",
          type: FORM_TYPE.SELECT,
          required: true,
          options: materialOptions,
        },
        {
          key: "quantity",
          label: "Quantity",
          type: FORM_TYPE.NUMBER,
          required: true,
        },
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
