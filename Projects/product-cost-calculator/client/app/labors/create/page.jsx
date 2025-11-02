import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.labors}
      basePath={BASE_PATH.labors}
      title="Labor"
      fields={[
        { key: "name", label: "Labor Name", type: FORM_TYPE.TEXT, required: true },
        { key: "type", label: "Type", type: FORM_TYPE.SELECT, required: true },
        { key: "rate_per_hour", label: "Rate/Hr", type: FORM_TYPE.TEXT, required: true },
        { key: "overtime_rate", label: "Over Time Rate", type: FORM_TYPE.TEXT },
      ]}
    />
  );
}
