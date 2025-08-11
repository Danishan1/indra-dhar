import { Route, Routes, useNavigate } from "react-router-dom";
import ActionButtons from "../../admin/jsx/ActionButtons";
import { CreatePhaseForm } from "../../admin/jsx/CreatePhaseForm";
import ViewPhases from "../../admin/jsx/ViewPhases";
import { UpdatePhase } from "../../admin/jsx/UpdatePhase";
import { api } from "../../../api/api";
import { useToast } from "../../../context/ToastContext";

const actions = [
  { label: "Update Phase", id: "update-phase", variant: "secondary" },
  { label: "Delete Phase", id: "delete-phase", variant: "danger" },
];

export const PhaseActions = ({ data }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const handleSuccess = (action) => {
    navigate(`/admin/view-phase`);
  };

  const handleAction = async (action) => {
    if (action === "delete-phase") {
      if (!window.confirm("Are you sure you want to delete this phase?")) {
        return;
      }
      try {
        const response = await api.delete(`/admin/phases/${data.value}`);
        addToast(response.data.message || "Phase deleted", "success");
        navigate(`/admin/view-phase`);
      } catch (err) {
        addToast(
          err.response?.data?.error || "Failed to delete phase",
          "error"
        );
      }
      return;
    }

    navigate(`/admin/${action}`);
  };

  return (
    <div>
      <h1>Phase Actions</h1>
      <ActionButtons actions={actions} onAction={handleAction} />

      <Routes>
        <Route
          path="/"
          element={<UpdatePhase data={data} onSuccess={handleSuccess} />}
        />
      </Routes>
    </div>
  );
};
