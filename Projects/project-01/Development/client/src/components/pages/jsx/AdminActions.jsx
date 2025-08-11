import { Route, Routes, useNavigate } from "react-router-dom";
import ActionButtons from "../../admin/jsx/ActionButtons";
import { CreatePhaseForm } from "../../admin/jsx/CreatePhaseForm";
import ViewPhases from "../../admin/jsx/ViewPhases";

export const AdminActions = () => {
  const navigate = useNavigate();
  const handleSuccess = (action) => {
    navigate(`/admin`);
  };

  const handleAction = (action) => {
    navigate(`/admin/${action}`);
  };

  return (
    <div>
      <h1>Admin Actions</h1>
      <ActionButtons onAction={handleAction} />

      <Routes>
        <Route path="/" element={<></>} />
        <Route
          path="/create-phase"
          element={<CreatePhaseForm onSuccess={handleSuccess} />}
        />
        <Route path="/view-phase" element={<ViewPhases />} />
      </Routes>
    </div>
  );
};
