import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Raw Materials"
      endpoint={BASE_PATH.rawMaterial}
      basePath={BASE_PATH.rawMaterial}
      columns={[
        { key: "name", title: "Raw Material Name"},
        { key: "unit_type", title: "Unit Type",},
        { key: "unit_price", title: "Unit Price"},
        { key: "stock_quantity", title: "Stock Quantity"},
        { key: "reorder_level", title: "Reorder Level"},
        { key: "vendor_name", title: "Vendor Name"},
      ]}
    />
  );
}
