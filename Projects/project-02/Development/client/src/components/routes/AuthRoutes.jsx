import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/jsx/Dashboard";
import ErrorPage from "../pages/jsx/ErrorPage";

export default function ProtectedAppRoutes() {
  return (
    <Routes>
      <Route path="/user/*" element={<Dashboard />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Add more protected routes here */}
    </Routes>
  );
}
