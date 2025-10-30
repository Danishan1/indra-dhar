"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUtil } from "@/utils/api";
import { DeleteConfirm } from "@/components/common";
import { BASE_PATH } from "@/utils/basePath";
import { useCrud } from "@/components/common/jsx/CrudLayout";

export default function VendorDeletePage() {
  const { idSelected } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedId } = useCrud();

  // Fetch record details for confirmation
  useEffect(() => {
    async function fetchRecord() {
      try {
        const res = await apiUtil.get(`${BASE_PATH.vendors}/${idSelected}`);
        setRecord(res.data);
      } catch (err) {
        console.error("Failed to fetch record:", err);
      }
      setLoading(false);
    }
    fetchRecord();
  }, [idSelected]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!record)
    return (
      <p style={{ textAlign: "center", color: "var(--color-danger)" }}>
        Record not found.
      </p>
    );

  return <DeleteConfirm id={idSelected} endpoint="/vendors" record={record} setSelectedId={setSelectedId} />;
}
