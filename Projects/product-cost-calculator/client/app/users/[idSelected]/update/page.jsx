import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function UpdatePage() {
 
  return (
    <CrudFormPage
      mode="update"
      endpoint={BASE_PATH.users}
      basePath={BASE_PATH.users}
      title="User"
      fields={[
        { key: "name", label: "User Name", type: FORM_TYPE.TEXT },
        { key: "email", label: "Email", type: FORM_TYPE.EMAIL },
        { key: "password_hash", label: "Password", type: FORM_TYPE.PASSWORD },
        // { key: "role", label: "role", type: FORM_TYPE.SELECT },
        // { key: "status", label: "Status", type: FORM_TYPE.SELECT },
      ]}
    />
  );
}
