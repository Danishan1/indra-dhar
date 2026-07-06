import { CrudListPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function ListPage() {
  return (
    <CrudListPage
      title="All Leads"
      endpoint={BASE_PATH.leads}
      basePath={BASE_PATH.leads}
      columns={[
        { key: "lead_number", title: "Lead No." },
        { key: "first_name", title: "First Name" },
        { key: "last_name", title: "Last Name" },
        { key: "company", title: "Company" },
        { key: "mobile", title: "Mobile" },
        { key: "email", title: "Email" },
        { key: "source_name", title: "Source" },
        { key: "priority_name", title: "Priority" },
        { key: "pipeline_name", title: "Pipeline" },
        { key: "stage_name", title: "Stage" },
        { key: "assigned_to_name", title: "Assigned To" },
      ]}
    />
  );
}
