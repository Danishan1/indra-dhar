"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { useCrud } from "@/components/common/jsx/CrudLayout";
import { useRole } from "@/hooks/useRole";
import { BASE_PATH } from "@/utils/basePath";
import { getFilterList } from "../helper/getFilterList";

export function CrudListPage({
  title,
  endpoint,
  basePath,
  columns,
  editButton = true,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setSelectedId } = useCrud();
  const [data, setData] = useState([]);
  const { isPrivileged, isManager } = useRole();

  const isUserManagement = basePath === BASE_PATH.users && isManager;
  const isAllowed = !isUserManagement && isPrivileged;
  const isBom = basePath === BASE_PATH.bom;

  const filters = getFilterList(pathname);

  // Fetch data whenever query params change
  useEffect(() => {
    const fetchData = async () => {
      const query = searchParams.toString();
      const url = query ? `${endpoint}?${query}` : endpoint;

      const res = await apiUtil.get(url);

      if (res.success) setData(res.data);
    };

    fetchData();
  }, [endpoint, searchParams]);

  const rowButtons = (row) => {
    const config = [
      {
        label: "View",
        allowed: true,
        path: `${basePath}/${row.id}/get`,
      },
      {
        label: isBom ? "Add BOM Items": "Edit",
        allowed: editButton && isAllowed, // your existing condition
        path: `${basePath}/${row.id}/update`,
      },
      {
        label: "Delete",
        allowed: isAllowed, // only admin/manager can delete
        path: `${basePath}/${row.id}/delete`,
      },
    ];

    return config
      .filter((btn) => btn.allowed)
      .map((btn) => ({
        label: btn.label,
        onClick: () => router.push(btn.path),
      }));
  };

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
      <h2>{title}</h2>
      <Table
        columns={columns}
        data={data}
        rowClickable
        onRowClick={(row) => setSelectedId(row.id)}
        rowButtons={rowButtons}
        filtersConfig={filters}
        onApplyFilters={onApplyFilters}
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
