import { CrudDeletePage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function DeletePage() {
  return <CrudDeletePage endpoint={BASE_PATH.labors} />;
}
