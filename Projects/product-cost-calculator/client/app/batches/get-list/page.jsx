import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Batches"
      endpoint={BASE_PATH.batches}
      basePath={BASE_PATH.batches}
      columns={[
        { key: "product_id", title: "Product Name" },
        { key: "batch_size", title: "Batch Size" },
        { key: "start_date", title: "Start Date" },
        { key: "end_date", title: "End Date" },
        { key: "status", title: "Status" },
        { key: "remarks", title: "Remarks" },
      ]}
    />
  );
}
