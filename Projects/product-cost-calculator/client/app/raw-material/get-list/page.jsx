import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Raw Materials"
      endpoint={BASE_PATH.rawMaterial}
      basePath={BASE_PATH.rawMaterial}
      columns={[
        { key: "id", title: "RM Code" },
        { key: "name", title: "Cost of Martials Name" },
        { key: "unit_code", title: "Unit of Measure" },
        { key: "unit_price", title: "Material Rate" },
        { key: "gst", title: "GST" },
        // { key: "stock_quantity", title: "Stock Quantity"},
        // { key: "reorder_level", title: "Reorder Level"},
        // { key: "vendor_name", title: "Vendor Name"},
      ]}
    />
  );
}
