"use client";
import { useRouter } from "next/navigation";
import { useCrud } from "@/components/common/jsx/CrudLayout";

export default function UsersListPage() {
  const { setSelectedId } = useCrud();
  const router = useRouter();

  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];

  const handleSelect = (id) => {
    setSelectedId(id);
    router.push(`/users/${id}/get`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>All Users</h2>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              onClick={() => handleSelect(u.id)}
              style={{ cursor: "pointer" }}
            >
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
