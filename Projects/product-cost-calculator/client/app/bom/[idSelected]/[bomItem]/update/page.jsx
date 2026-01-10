"use client";

import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;
import { useFetchOptions } from "@/hooks/useFetchOptions";
import { useParams } from "next/navigation";

export default function UpdatePage() {
  const materialOptions = useFetchOptions({ endpoint: BASE_PATH.rawMaterial });
  const { idSelected, bomItem } = useParams();

  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.bomItem}
      basePath={BASE_PATH.bom + `/${idSelected}/update`}
      title="BOM Item"
      fields={[
        {
          key: "material_id",
          label: "Material",
          type: FORM_TYPE.SELECT,
          options: materialOptions,
        },
        {
          key: "quantity",
          label: "Quantity",
          type: FORM_TYPE.NUMBER,
        },
        {
          key: "decimal_allowed",
          label: "Decimal Allowed",
          type: FORM_TYPE.SWITCH,
        },
      ]}
    />
  );
}
