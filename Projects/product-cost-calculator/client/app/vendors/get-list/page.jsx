import { CrudListPage } from "@/components/layout";
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
