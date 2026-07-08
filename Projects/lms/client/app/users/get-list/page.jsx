import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Users"
      endpoint={BASE_PATH.users}
      basePath={BASE_PATH.users}
      columns={[
        { key: "full_name", title: "Name" },
        { key: "email", title: "Email" },
        { key: "role", title: "role" },
        { key: "last_login", title: "Last login" },
      ]}
    />
  );
}
