import { useAuth } from "@/context";

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isPrivileged = isAdmin || isManager;

  return {
    role,
    isAdmin,
    isManager,
    isPrivileged,
  };
};
