"use client";

import { ResourceTables } from "@/components/projects/jsx/ResourceTables";
import { apiUtil } from "@/utils/api";
import { BASE_PATH } from "@/utils/basePath";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailPage() {
  const [resources, setResources] = useState([]);
  const { idSelected } = useParams();

  useEffect(() => {
    async function fetchData() {
      const res = await apiUtil.get(`${BASE_PATH.projectsCost}/${idSelected}`);
      if (res.success) setResources(res.data.items);
    }
    fetchData();
  }, [idSelected]);

  return <ResourceTables resources={resources} />;
}
