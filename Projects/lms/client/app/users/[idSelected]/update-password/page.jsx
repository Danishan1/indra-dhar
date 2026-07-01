"use client";

import { usePathname } from "next/navigation";

export default function NewPage() {
  const pathname = usePathname();

  return <p>New page: {pathname}</p>;
}
