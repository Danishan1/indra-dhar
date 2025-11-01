"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUtil } from "@/utils/api";
import { DataDetails } from "@/components/common";

export function CrudDetailPage({ endpoint }) {
  const { idSelected } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await apiUtil.get(`${endpoint}/${idSelected}`);
      if (res.success) setData(res.data);
      setLoading(false);
    }
    fetchData();
  }, [endpoint, idSelected]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return <DataDetails data={data} />;
}

/*

import { CrudDetailPage } from "@/components/common/layout/CrudDetailPage";
import { BASE_PATH } from "@/utils/basePath";

export default function VendorDetailPage() {
  return <CrudDetailPage endpoint={BASE_PATH.vendors} />;
}


*/