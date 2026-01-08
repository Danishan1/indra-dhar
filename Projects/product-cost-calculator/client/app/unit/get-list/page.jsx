import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="Unit of Materials"
      endpoint={BASE_PATH.unit}
      basePath={BASE_PATH.unit}
      columns={[
        { key: "unit_code", title: "Unit Code" },
        { key: "name", title: "Unit Name" },
        { key: "base_unit", title: "Base Unit" },
        { key: "decimal_allowed", title: "Decimal Allowed" },
      ]}
    />
  );
}
