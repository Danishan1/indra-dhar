import { CrudDeletePage } from "@/components/layout";
import { BASE_PATH } from "@/utils/basePath";

export default function VendorDeletePage() {
  return <CrudDeletePage endpoint={BASE_PATH.vendors} />;
}
