import { CrudDetailPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function DetailPage() {
  return <CrudDetailPage endpoint={BASE_PATH.users} />;
}
