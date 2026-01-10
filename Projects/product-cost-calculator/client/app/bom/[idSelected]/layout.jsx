"use client";
import { BASE_PATH } from "@/utils/basePath";
import styles from "./layout.module.css";
import { useAPICaller } from "@/hooks/useAPICaller";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui";

export default function Layout({ children }) {
  const basePath = BASE_PATH.bom;
  const { idSelected } = useParams();

  const { data, loading, error } = useAPICaller(
    BASE_PATH.bom + `/${idSelected}`
  );

  console.log("BOM Data:", data, loading, error);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading BOM data.</p>;
  if (data?.success === false) return <p>{data.message || "BOM not found."}</p>;

  return (
    <div className={styles.layout}>
      <div className={styles.topbar}>
        <p>{`BOM for ${data?.data?.name || ""}`}</p>
        <Button onClick={() => window.location.href = `${BASE_PATH.bom}/${idSelected}/create`}>
          Add New BOM Item
        </Button>
      </div>
      {children}
    </div>
  );
}
