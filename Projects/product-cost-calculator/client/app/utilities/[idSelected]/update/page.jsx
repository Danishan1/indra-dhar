import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.utilities}
      basePath={BASE_PATH.utilities}
      title="Utility"
      fields={[
        { key: "name", label: "Utility Name", type: FORM_TYPE.TEXT },
        { key: "cost_per_unit", label: "Cost/Unit", type: FORM_TYPE.TEXT },
        { key: "unit_type", label: "Unit Type", type: FORM_TYPE.TEXT },
      ]}
    />
  );
}
