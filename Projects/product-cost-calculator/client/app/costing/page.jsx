"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/users/get-list");
  }, [router]);

  return <p style={{ padding: "2rem" }}>Redirecting to users list...</p>;
}
