import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Products"
      endpoint={BASE_PATH.products}
      basePath={BASE_PATH.products}
      columns={[
        { key: "name", title: "Product Name" },
        { key: "sku", title: "SKU" },
        { key: "description", title: "Description" },
        { key: "default_batch_size", title: "Default Batch Size" },
        { key: "address", title: "Address" },
      ]}
    />
  );
}
