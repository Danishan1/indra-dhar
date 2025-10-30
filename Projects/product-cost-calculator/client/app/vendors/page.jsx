"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "@/utils/basePath";

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`${BASE_PATH.vendors}/get-list`);
  }, [router]);

  return <p style={{ padding: "2rem" }}>Redirecting to users list...</p>;
}
