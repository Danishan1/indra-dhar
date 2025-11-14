"use client";

import { useAuth } from "@/context";
import { routePermissions } from "@/utils/routePermissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allow, setAllow] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (pathname === "/login" || pathname === "/register") {
        setAllow(true);
        return;
      }

      router.push("/login");
      return;
    }

    const normalized = normalizePath(pathname);
    const allowedRoles = getAllowedRoles(normalized);

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return;
    }

    setAllow(true);
  }, [pathname]);

  function normalizePath(path) {
    const parts = path.split("/").filter(Boolean);

    // CASE 1: /raw-material/get-list → already static
    if (parts.length === 2) return "/" + parts.join("/");

    // CASE 2: /raw-material/12/update → remove numeric or dynamic segment
    // Keep: [resource, action]
    const resource = parts[0];
    const action = parts[parts.length - 1];

    return `/${resource}/${action}`;
  }

  function getAllowedRoles(normalizedPath) {
    return routePermissions[normalizedPath] || null;
  }

  if (!allow) return null;

  return <>{children}</>;
}
