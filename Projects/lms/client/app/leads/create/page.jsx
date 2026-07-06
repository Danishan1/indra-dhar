import { CrudFormPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";
import { CONST } from "@/utils/CONST";

const { FORM_TYPE } = CONST;

export default function CreateLeadPage() {
  return (
    <div>
      <CrudFormPage
        mode="create"
        endpoint={BASE_PATH.leads}
        basePath={BASE_PATH.leads}
        title="Lead"
        fields={[
          {
            key: "lead_number",
            label: "Lead Number",
            type: FORM_TYPE.TEXT,
            required: true,
          },
          {
            key: "first_name",
            label: "First Name",
            type: FORM_TYPE.TEXT,
            required: true,
          },
          {
            key: "last_name",
            label: "Last Name",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "company",
            label: "Company",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "mobile",
            label: "Mobile",
            type: FORM_TYPE.TEXT,
            required: true,
          },
          {
            key: "email",
            label: "Email",
            type: FORM_TYPE.EMAIL,
          },
          {
            key: "address",
            label: "Address",
            type: FORM_TYPE.TEXTAREA,
          },
          {
            key: "city",
            label: "City",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "state",
            label: "State",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "country",
            label: "Country",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "postal_code",
            label: "Postal Code",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "product_interest",
            label: "Product Interest",
            type: FORM_TYPE.TEXT,
          },
          {
            key: "budget",
            label: "Budget",
            type: FORM_TYPE.NUMBER,
          },

          // Master Data
          {
            key: "source_id",
            label: "Lead Source",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.leadSources,
            optionLabel: "name",
            optionValue: "id",
          },
          {
            key: "priority_id",
            label: "Priority",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.leadPriorities,
            optionLabel: "name",
            optionValue: "id",
          },
          {
            key: "pipeline_id",
            label: "Pipeline",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.pipelines,
            optionLabel: "name",
            optionValue: "id",
          },
          {
            key: "stage_id",
            label: "Stage",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.pipelineStages,
            optionLabel: "name",
            optionValue: "id",
          },

          // Assignment
          {
            key: "assigned_to",
            label: "Assigned To",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.users,
            optionLabel: "name",
            optionValue: "id",
          },
          {
            key: "manager_id",
            label: "Manager",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.users,
            optionLabel: "name",
            optionValue: "id",
          },
          {
            key: "team_id",
            label: "Team",
            type: FORM_TYPE.SELECT,
            endpoint: BASE_PATH.teams,
            optionLabel: "name",
            optionValue: "id",
          },

          {
            key: "remarks",
            label: "Remarks",
            type: FORM_TYPE.TEXTAREA,
          },
        ]}
      />
    </div>
  );
}
