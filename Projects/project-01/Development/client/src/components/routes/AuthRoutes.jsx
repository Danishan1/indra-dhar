import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/jsx/Dashboard";
import ErrorPage from "../pages/jsx/ErrorPage";
import { AdminActions } from "../pages/jsx/AdminActions";
// import other private pages here

export default function ProtectedAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminActions />} />
      <Route path="/admin/*" element={<AdminActions />} />
      <Route path="/user/*" element={<Dashboard />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Add more protected routes here */}
    </Routes>
  );
}
