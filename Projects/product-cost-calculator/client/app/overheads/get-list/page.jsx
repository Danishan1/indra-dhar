import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Overheads"
      endpoint={BASE_PATH.overheads}
      basePath={BASE_PATH.overheads}
      columns={[
        { key: "name", title: "Overhead Name" },
        { key: "type", title: "Type" },
        { key: "monthly_value", title: "Month Amount" },
        { key: "yearly_value", title: "Yearly Amount" },
        { key: "per_hour_value", title: "Per Hour" },
        { key: "frequency", title: "Allocation Bases" },
        // { key: "is_global", title: "Is Global" },
      ]}
    />
  );
}
