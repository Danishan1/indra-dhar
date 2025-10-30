"use client";

import { DataDetails } from "@/components/common";
import { apiUtil } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewPage() {
  const [data, setData] = useState({});
  const { idSelected } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiUtil.get(`/vendors/${idSelected}`);

      if (response.success) {
        const data = response.data;
        setData(data);
      }
    };

    fetchData();
  }, []);

  return <DataDetails data={data} />;
}
