import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {

  return (
    <CrudFormPage
      mode="create"
      endpoint="/vendors"
      basePath={BASE_PATH.vendors}
      title="Vendor"
      fields={[
        { key: "name", label: "Vendor Name", type: FORM_TYPE.TEXT, required: true },
        { key: "contact_name", label: "Contact Name", type: FORM_TYPE.TEXT },
        { key: "email", label: "Email", type: FORM_TYPE.EMAIL, required: true },
        { key: "phone", label: "Phone", type: FORM_TYPE.TEXT, required: true },
        { key: "address", label: "Address", type: FORM_TYPE.TEXT },
      ]}
    />
  );
}
