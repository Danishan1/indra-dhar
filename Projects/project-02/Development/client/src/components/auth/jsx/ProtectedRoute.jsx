// ProtectedRoute.tsx
import { useAuth } from "../../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or spinner
  }

  if (!user) {
    // No React /login route, so let AuthProvider handle redirect
    return <div>Redirecting to login...</div>;
  }

  return children;
}
