import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Labors"
      endpoint={BASE_PATH.labors}
      basePath={BASE_PATH.labors}
      columns={[
        { key: "name", title: "Labor Name" },
        { key: "labor_type", title: "Type" },
        { key: "rate_per_hour", title: "Rate/Hr" },
        { key: "overtime_rate", title: "Over Time Rate" },
        { key: "remark", title: "Remark" },
      ]}
    />
  );
}
