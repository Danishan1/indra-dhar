import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.machines}
      basePath={BASE_PATH.machines}
      title="Machine"
      fields={[
        { key: "name", label: "Machine Name", type: FORM_TYPE.TEXT },
        { key: "cost_per_hour", label: "Cost/Hr", type: FORM_TYPE.TEXT },
        { key: "maintenance_cost", label: "Maintenance Cost", type: FORM_TYPE.TEXT },
      ]}
    />
  );
}
