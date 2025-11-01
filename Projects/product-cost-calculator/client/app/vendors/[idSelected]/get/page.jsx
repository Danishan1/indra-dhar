import { CrudDetailPage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function VendorDetailPage() {
  return <CrudDetailPage endpoint={BASE_PATH.vendors} />;
}
