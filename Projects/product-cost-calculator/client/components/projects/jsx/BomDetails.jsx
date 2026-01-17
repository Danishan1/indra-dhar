"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { BASE_PATH } from "@/utils/basePath";
import { getFilterList } from "@/components/layout";

export function BomDetails({ bomItem }) {
    
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);

  const filters = getFilterList(pathname);

  // Fetch data whenever query params change
  useEffect(() => {
    const fetchData = async () => {
      const query = searchParams.toString();
      const endpoint = `${BASE_PATH.bomItem}/bom/${bomItem.resource_id}`;
      const url = query ? `${endpoint}?${query}` : endpoint;

      const res = await apiUtil.get(url);

      if (res.success) setData(res.data);
    };

    fetchData();
  }, [bomItem, searchParams]);

  const onApplyFilters = (values) => {
    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>BOM Details of {bomItem?.resource_name}</h2>
      <Table
        columns={[
          { key: "material_name", title: "Material Name" },
          { key: "decimal_allowed", title: "Decimal Allowed" },
          { key: "quantity", title: "Quantity" },
          { key: "material_unit_price", title: "Unit Price" },
          { key: "material_is_gst_itc", title: "GST ITC" },
          { key: "material_gst", title: "GST %" },
        ]}
        data={data}
        filtersConfig={filters}
        onApplyFilters={onApplyFilters}
      />
    </div>
  );
}
