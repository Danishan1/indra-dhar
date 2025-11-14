import { CrudDeletePage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function DeletePage() {
  return (
    <CrudDeletePage
      endpoint={BASE_PATH.projectsCost}
      basePath={`${BASE_PATH.projects}/get-list`}
    />
  );
}
