"use client";

import { Button } from "@/components/ui";
import styles from "./unauthorized.module.css";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Access Denied</h1>

        <p className={styles.message}>
          You do not have permission to view this page.
        </p>

        <Button
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
