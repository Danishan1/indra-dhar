"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/projects/get-list");
  }, [router]);

  return <p style={{ padding: "2rem" }}>Redirecting to users list...</p>;
}
