"use client";

import { CrudDeletePage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { useParams } from "next/navigation";

export default function DeletePage() {
  const { idSelected } = useParams();
  return (
    <CrudDeletePage
      endpoint={BASE_PATH.bomItem}
      basePath={BASE_PATH.bom + `/${idSelected}/update`}
      isBomItem={true}
    />
  );
}
