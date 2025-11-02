import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Machines"
      endpoint={BASE_PATH.machines}
      basePath={BASE_PATH.machines}
      columns={[
        { key: "name", title: "Machine Name" },
        { key: "cost_per_hour", title: "Cost/Hr" },
        { key: "maintenance_cost", title: "Maintenance Cost" },
      ]}
    />
  );
}
