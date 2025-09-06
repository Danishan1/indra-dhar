import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Dashboard from "../pages/jsx/Dashboard";
import ErrorPage from "../pages/jsx/ErrorPage";
import { CreateMasterData } from "../kora/jsx/CreateMasterData";
import { MoveToPhases } from "../kora/jsx/MoveToPhases";
import BulkItemsTable from "../dashboard/jsx/BulkItemsTable";
import { BulkItemDetails } from "../pages/jsx/BulkItemDetails";
import { useAuth } from "../../context/AuthContext";
import { MoveBulkForward } from "../kora/jsx/MoveBulkFOrward";
import BulkUpload from "../pages/jsx/BulkUpload";

export default function ProtectedAppRoutes() {
  const { user } = useAuth();

  if (!user) return <>No User Found</>;

  const role = user.role;

  if (role === "po") {
    return (
      <Routes>
        <Route path="/" element={<Navigate to={"/user/view-item-list/Po"} />} />
        <Route path="/user/create-po" element={<CreateMasterData />} />
        <Route path="/user/create-bulk-po" element={<BulkUpload />} />
        <Route
          path="/user/view-item-list/:phaseName"
          element={<BulkItemsTable />}
        />
        <Route path="/user/view-item/:bulkId" element={<BulkItemDetails />} />
        <Route
          path="/user/:move/:phaseName/:bulkId"
          element={<MoveToPhases />}
        />
        <Route path="user/move-bulk/:phaseName" element={<MoveBulkForward />} />

        <Route path="*" element={<ErrorPage />} />

        {/* Add more protected routes here */}
      </Routes>
    );
  } else
    return (
      <Routes>
        <Route path="/" element={<Navigate to={"/user"} />} />

        <Route path="/user" element={<Dashboard />} />
        {/* <Route path="/user/create-master" element={<CreateMasterData />} /> */}
        <Route
          path="/user/view-item-list/:phaseName"
          element={<BulkItemsTable />}
        />
        <Route path="/user/view-item/:bulkId" element={<BulkItemDetails />} />
        <Route
          path="/user/:move/:phaseName/:bulkId"
          element={<MoveToPhases />}
        />
        <Route path="user/move-bulk/:phaseName" element={<MoveBulkForward />} />
        <Route path="*" element={<ErrorPage />} />

        {/* Add more protected routes here */}
      </Routes>
    );
}
