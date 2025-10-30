"use client";
import { useRouter } from "next/navigation";
import { useCrud } from "@/components/common/jsx/CrudLayout";
import { Table } from "@/components/ui";
import { useEffect, useState } from "react";
import { apiUtil } from "@/utils/api";
import { BASE_PATH } from "@/utils/basePath";

export default function UsersListPage() {
  const { setSelectedId } = useCrud();
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiUtil.get("/vendors");

      if (response.success) {
        setData(response.data);
      }
    };

    fetchData();
  }, []);

  const users = [
    // { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    // { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    // {
    //   id: 3,
    //   name: "Charlie Brown",
    //   email: "charlie@example.com",
    //   role: "User",
    // },
  ];

  // Define columns (what to show)
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "contact_name", title: "Contact Name" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Mobile" },
    { key: "address", title: "Address" },
  ];

  // Define buttons for each row
  const rowButtons = (row) => [
    {
      label: "View",
      onClick: (data) => router.push(`${BASE_PATH.vendors}/${row.id}/get`),
    },
    {
      label: "Edit",
      onClick: (data) => router.push(`${BASE_PATH.vendors}/${row.id}/update`),
    },
  ];

  // When a row is clicked
  const handleRowClick = (row) => {
    setSelectedId(row.id);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>All Vendors</h2>
      <Table
        columns={columns}
        data={data}
        rowClickable
        onRowClick={handleRowClick}
        rowButtons={rowButtons}
      />
    </div>
  );
}
