import { Route, Routes, useNavigate } from "react-router-dom";
import ActionButtons from "../../admin/jsx/ActionButtons";
import { CreatePhaseForm } from "../../admin/jsx/CreatePhaseForm";
import ViewPhases from "../../admin/jsx/ViewPhases";
import { UpdatePhase } from "../../admin/jsx/UpdatePhase";
import { PhaseActions } from "./PhaseActions";
import { useState } from "react";
import { CreateUserForm } from "../../admin/jsx/CreateUserForm";
import ViewUsers from "../../admin/jsx/ViewUsers";
import { UserActions } from "./UserActions";
import Dashboard from "./Dashboard";
import Button from "../../common/jsx/Button";
import { useAuth } from "../../../context/AuthContext";

const actions = [
  { label: "Create New Phase", id: "create-phase", variant: "primary" },
  { label: "View Phase", id: "view-phase", variant: "primary" },
  { label: "Create User", id: "create-user", variant: "primary" },
  { label: "View User", id: "view-user", variant: "primary" },
  // { label: "View Form", id: "view-item-form", variant: "primary" },
  // { label: "Create Item Form", id: "create-item-form", variant: "primary" },
  { label: "View Dashboard", id: "view-dashboard", variant: "secondary" },
];

export const AdminActions = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const { logout } = useAuth();
  const handleSuccess = (success) => {
    setData(success);
  };

  const handleAction = (action) => {
    navigate(`/admin/${action}`);
  };

  return (
    <div>
      <h1>Admin Actions</h1>
      <Button onClick={() => logout()}> Logout </Button>
      <ActionButtons actions={actions} onAction={handleAction} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/view-dashboard" element={<Dashboard />} />
        <Route
          path="/create-phase"
          element={<CreatePhaseForm onSuccess={handleSuccess} />}
        />
        <Route
          path="/create-user"
          element={<CreateUserForm onSuccess={handleSuccess} />}
        />
        <Route path="/view-phase" element={<ViewPhases setData={setData} />} />
        <Route path="/view-user" element={<ViewUsers setData={setData} />} />
        <Route path="/phases/edit/*" element={<PhaseActions data={data} />} />
        <Route path="/users/edit/*" element={<UserActions data={data} />} />
      </Routes>
    </div>
  );
};
