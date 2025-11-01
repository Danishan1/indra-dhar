import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function UpdateVendorPage() {
  return (
    <CrudFormPage
      mode="update"
      endpoint="/vendors"
      basePath={BASE_PATH.vendors}
      title="Vendor"
      fields={[
        { key: "name", label: "Vendor Name", type: "text", required: true },
        { key: "contact_name", label: "Contact Name", type: "text" },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text", required: true },
        { key: "address", label: "Address", type: "text" },
      ]}
    />
  );
}
