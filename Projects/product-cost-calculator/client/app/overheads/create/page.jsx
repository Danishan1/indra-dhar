import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.overheads}
      basePath={BASE_PATH.overheads}
      title="Overhead"
      fields={[
        { key: "name", label: "Overhead Name", type: FORM_TYPE.TEXT, required: true },
        { key: "type", label: "Type", type: FORM_TYPE.SELECT , required: true },
        { key: "value", label: "Value", type: FORM_TYPE.TEXT, required: true },
        { key: "frequency", label: "Frequency", type: FORM_TYPE.SELECT, required: true },
        { key: "is_global", label: "Is Global", type: FORM_TYPE.SELECT },
      ]}
    />
  );
}
