import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Utilities"
      endpoint={BASE_PATH.utilities}
      basePath={BASE_PATH.utilities}
      columns={[
        { key: "name", title: "Utility Name" },
        { key: "cost_per_unit", title: "Cost/Unit" },
        { key: "unit_type", title: "Unit Type" },
      ]}
    />
  );
}
