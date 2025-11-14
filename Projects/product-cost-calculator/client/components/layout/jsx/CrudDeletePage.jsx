"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUtil } from "@/utils/api";
import { DeleteConfirm } from "@/components/common";
import { useCrud } from "@/components/common/jsx/CrudLayout";

export function CrudDeletePage({ endpoint, basePath = null }) {
  const { idSelected } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedId } = useCrud();

  useEffect(() => {
    async function fetchRecord() {
      try {
        const res = await apiUtil.get(`${endpoint}/${idSelected}`);
        if (res.success) setRecord(res.data);
      } catch (err) {
        console.error("Failed to fetch record:", err);
      }
      setLoading(false);
    }
    fetchRecord();
  }, [endpoint, idSelected]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!record)
    return (
      <p style={{ textAlign: "center", color: "var(--color-danger)" }}>
        Record not found.
      </p>
    );

  return (
    <DeleteConfirm
      id={idSelected}
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
