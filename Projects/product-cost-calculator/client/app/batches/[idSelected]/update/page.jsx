import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.batches}
      basePath={BASE_PATH.batches}
      title="Batch"
      fields={[
        { key: "product_id", label: "Product Name", type: FORM_TYPE.SELECT },
        { key: "batch_size", label: "Batch Size", type: FORM_TYPE.TEXT },
        { key: "start_date", label: "Start Date", type: FORM_TYPE.TEXT },
        { key: "end_date", label: "End Date", type: FORM_TYPE.TEXT },
        { key: "status", label: "Status", type: FORM_TYPE.SELECT },
        { key: "remarks", label: "Remarks", type: FORM_TYPE.TEXTAREA },
      ]}
    />
  );
}
