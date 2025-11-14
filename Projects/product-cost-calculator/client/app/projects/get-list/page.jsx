import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Projects"
      endpoint={BASE_PATH.projectsCost}
      basePath={BASE_PATH.projects}
      columns={[
        { key: "id", title: "Product Id" },
        { key: "project_name", title: "Product Name" },
        { key: "total_cost", title: "Total Cost" },
        { key: "created_at", title: "Created At" },
      ]}
      editButton={false}
    />
  );
}
