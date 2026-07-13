"use client";

import { useAuth } from "@/context";
import { routePermissions } from "@/utils/routePermissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [allow, setAllow] = useState(false);

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
    const allowedRoles = routePermissions[normalized];

    // const roleName = user.role?.name || "admin";
    const roleName = "admin";

    if (allowedRoles && !allowedRoles.includes(roleName)) {
      router.push("/unauthorized");
      return;
    }

    setAllow(true);
  }, [pathname, user]);

  function normalizePath(path) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 2) return "/" + parts.join("/");
    return `/${parts[0]}/${parts[parts.length - 1]}`;
  }

  if (!allow) return null;

  return <>{children}</>;
}
