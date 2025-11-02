"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { useCrud } from "@/components/common/jsx/CrudLayout";

export function CrudListPage({ title, endpoint, basePath, columns }) {
  const router = useRouter();
  const { setSelectedId } = useCrud();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiUtil.get(endpoint);
      if (res.success) setData(res.data);
    };
    fetchData();
  }, [endpoint]);

  const rowButtons = (row) => [
    { label: "View", onClick: () => router.push(`${basePath}/${row.id}/get`) },
    { label: "Edit", onClick: () => router.push(`${basePath}/${row.id}/update`) },
    { label: "Delete", onClick: () => router.push(`${basePath}/${row.id}/delete`) },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{title}</h2>
      <Table
        columns={columns}
        data={data}
        rowClickable
        onRowClick={(row) => setSelectedId(row.id)}
        rowButtons={rowButtons}
      />
    </div>
  );
}


/*

import {CrudListPage} from "@/components/common/layout/CrudListPage";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Vendors"
      endpoint="/vendors"
      basePath={BASE_PATH.vendors}
      columns={[
        { key: "id", title: "ID" },
        { key: "name", title: "Name" },
        { key: "contact_name", title: "Contact Name" },
        { key: "email", title: "Email" },
        { key: "phone", title: "Mobile" },
        { key: "address", title: "Address" },
      ]}
    />
  );
}


*/