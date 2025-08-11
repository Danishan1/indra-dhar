import { Route, Routes, useNavigate } from "react-router-dom";
import ActionButtons from "../../admin/jsx/ActionButtons";
import { CreatePhaseForm } from "../../admin/jsx/CreatePhaseForm";
import ViewPhases from "../../admin/jsx/ViewPhases";
import { UpdatePhase } from "../../admin/jsx/UpdatePhase";
import { PhaseActions } from "./PhaseActions";
import { useState } from "react";

const actions = [
  { label: "Create New Phase", id: "create-phase", variant: "primary" },
  { label: "View Phase", id: "view-phase", variant: "primary" },
  { label: "Create User", id: "create-user", variant: "primary" },
  { label: "View User", id: "view-user", variant: "primary" },
  { label: "Update User", id: "update-user", variant: "secondary" },
  { label: "Delete User", id: "delete-user", variant: "danger" },
  { label: "View Form", id: "view-item-form", variant: "primary" },
  { label: "Create Item Form", id: "create-item-form", variant: "primary" },
  { label: "View Dashboard", id: "view-dashboard", variant: "secondary" },
];

export const AdminActions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const handleSuccess = (success) => {
    setData(success);
  };

  const handleAction = (action) => {
    navigate(`/admin/${action}`);
  };

  return (
    <div>
      <h1>Admin Actions</h1>
      <ActionButtons actions={actions} onAction={handleAction} />

      <Routes>
        <Route path="/" element={<></>} />
        <Route
          path="/create-phase"
          element={<CreatePhaseForm onSuccess={handleSuccess} />}
        />
        <Route path="/view-phase" element={<ViewPhases setData={setData} />} />
        <Route path="/phases/edit/*" element={<PhaseActions data={data} />} />
      </Routes>
    </div>
  );
};
