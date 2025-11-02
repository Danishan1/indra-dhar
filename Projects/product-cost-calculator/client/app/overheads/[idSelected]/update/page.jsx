import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.overheads}
      basePath={BASE_PATH.overheads}
      title="Overhead"
      fields={[
        { key: "name", label: "Overhead Name", type: FORM_TYPE.TEXT },
        { key: "type", label: "Type", type: FORM_TYPE.SELECT  },
        { key: "value", label: "Value", type: FORM_TYPE.TEXT },
        { key: "frequency", label: "Frequency", type: FORM_TYPE.SELECT },
        { key: "is_global", label: "Is Global", type: FORM_TYPE.SELECT },
      ]}
    />
  );
}
