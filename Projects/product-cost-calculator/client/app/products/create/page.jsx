import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.products}
      basePath={BASE_PATH.products}
      title="Product"
      fields={[
        { key: "name", label: "Product Name", type: FORM_TYPE.TEXT, required: true },
        { key: "sku", label: "SKU", type: FORM_TYPE.TEXT, required: true },
        { key: "description", label: "Description", type: FORM_TYPE.TEXTAREA},
        { key: "default_batch_size", label: "Default Batch Size", type: FORM_TYPE.TEXT, required: true },
        { key: "address", label: "Address", type: FORM_TYPE.TEXT, required: true},
      ]}
    />
  );
}
