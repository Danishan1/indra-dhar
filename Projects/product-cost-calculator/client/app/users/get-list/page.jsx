import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Users"
      endpoint={BASE_PATH.users}
      basePath={BASE_PATH.users}
      columns={[
        { key: "name", title: "User Name" },
        { key: "email", title: "Email" },
        { key: "password_hash", title: "Password" },
        { key: "role", title: "role" },
        { key: "status", title: "Status" },
      ]}
    />
  );
}
