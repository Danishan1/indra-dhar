import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("auth");

  return token ? children : <Navigate to="/login" />;
}
