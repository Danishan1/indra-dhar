import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";
const { FORM_TYPE } = CONST;

export default function CreatePage() {
  return (
    <CrudFormPage
      mode="create"
      endpoint={BASE_PATH.users}
      basePath={BASE_PATH.users}
      title="User"
      fields={[
        { key: "name", label: "User Name", type: FORM_TYPE.TEXT, required: true },
        { key: "email", label: "Email", type: FORM_TYPE.EMAIL, required: true  },
        { key: "password_hash", label: "Password", type: FORM_TYPE.PASSWORD, required: true  },
        { key: "role", label: "role", type: FORM_TYPE.SELECT, required: true  },
      ]}
    />
  );
}
