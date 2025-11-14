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
        { key: "value", title: "Amount" },
        { key: "frequency", title: "Frequency" },
        // { key: "is_global", title: "Is Global" },
      ]}
    />
  );
}
