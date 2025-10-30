"use client";
import { useRouter } from "next/navigation";
import { useCrud } from "@/components/common/jsx/CrudLayout";
import { Table } from "@/components/ui";

export default function UsersListPage() {
  const { setSelectedId } = useCrud();
  const router = useRouter();

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
  ];

  // Define columns (what to show)
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
  ];

  // Define buttons for each row
  const rowButtons = (row) => [
    {
      label: "View",
      className: "btn-edit",
      onClick: (data) => console.log("Edit:", data),
    },
    {
      label: "Update",
      className: "btn-delete",
      onClick: (data) => console.log("Delete:", data),
    },
    {
      label: "Edit",
      className: "btn-edit",
      onClick: (data) => console.log("Edit:", data),
    },
  ];

  // When a row is clicked
  const handleRowClick = (row) => {
    // alert(`Row clicked: ${row.name}`);
    setSelectedId(row.id);
    // router.push(`/users/${row.id}/get`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>All Users</h2>
      <Table
        columns={columns}
        data={users}
        rowClickable
        onRowClick={handleRowClick}
        rowButtons={rowButtons}
      />
    </div>
  );
}
