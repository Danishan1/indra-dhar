import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All BOMs"
      endpoint={BASE_PATH.bom}
      basePath={BASE_PATH.bom}
      columns={[
        { key: "id", title: "BOM Code" },
        { key: "name", title: "BOM Name" },
      ]}
    />
  );
}
