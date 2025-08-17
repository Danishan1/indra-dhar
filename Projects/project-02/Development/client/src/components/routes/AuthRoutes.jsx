import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/jsx/Dashboard";
import ErrorPage from "../pages/jsx/ErrorPage";
import { CreateMasterData } from "../kora/jsx/CreateMasterData";
import { MoveToPhases } from "../kora/jsx/MoveToPhases";
import BulkItemsTable from "../dashboard/jsx/BulkItemsTable";

export default function ProtectedAppRoutes() {
  return (
    <Routes>
      <Route path="/user" element={<Dashboard />} />
      <Route path="/user/create-master" element={<CreateMasterData />} />
      <Route path="/user/view-items" element={<BulkItemsTable />} />
      <Route path="/user/:move/:phaseName/:bulkId" element={<MoveToPhases />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Add more protected routes here */}
    </Routes>
  );
}
