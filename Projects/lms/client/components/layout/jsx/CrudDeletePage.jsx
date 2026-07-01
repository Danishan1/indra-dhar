"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUtil } from "@/utils/api";
import { DeleteConfirm } from "@/components/common";
import { useCrud } from "@/components/common/jsx/CrudLayout";

export function CrudDeletePage({ endpoint, basePath = null, isBomItem = false }) {
  const { idSelected, bomItem } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedId } = useCrud();

  const finalIdSelected = isBomItem ? bomItem : idSelected;

  useEffect(() => {
    async function fetchRecord() {
      try {
        const res = await apiUtil.get(`${endpoint}/${finalIdSelected}`);
        if (res.success) setRecord(res.data);
      } catch (err) {
        console.error("Failed to fetch record:", err);
      }
      setLoading(false);
    }
    fetchRecord();
  }, [endpoint, finalIdSelected]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!record)
    return (
      <p style={{ textAlign: "center", color: "var(--color-danger)" }}>
        Record not found.
      </p>
    );

  return (
    <DeleteConfirm
      id={finalIdSelected}
      endpoint={endpoint}
      record={record}
      setSelectedId={setSelectedId}
      basePath={basePath}
    />
  );
}

/*

import CrudDeletePage from "@/components/common/layout/CrudDeletePage";
import { BASE_PATH } from "@/utils/basePath";

export default function DeletePage() {
  return <CrudDeletePage endpoint={BASE_PATH.vendors} />;
}


*/
