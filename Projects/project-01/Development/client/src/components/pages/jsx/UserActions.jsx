import { Route, Routes, useNavigate } from "react-router-dom";
import ActionButtons from "../../admin/jsx/ActionButtons";
import { UpdatePhase } from "../../admin/jsx/UpdatePhase";
import { api } from "../../../api/api";
import { useToast } from "../../../context/ToastContext";
import { UpdateUser } from "../../admin/jsx/UpdateUser";

const actions = [
  // { label: "Update User", id: "update-user", variant: "secondary" },
  { label: "Delete User", id: "delete-user", variant: "danger" },
];

export const UserActions = ({ data }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const handleSuccess = (action) => {
    navigate(`/admin/view-user`);
  };

  console.log("UserActions data:", data);

  const handleAction = async (action) => {
    if (action === "delete-user") {
      if (!window.confirm("Are you sure you want to delete this phase?")) {
        return;
      }
      try {
        const response = await api.delete(`/admin/users/${data.email}`);
        addToast(response.data.message || "Phase deleted", "success");
        navigate(`/admin/view-user`);
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
      <h1>User Actions</h1>
      <ActionButtons actions={actions} onAction={handleAction} />

      <Routes>
        <Route
          path="/"
          element={<UpdateUser data={data} onSuccess={handleSuccess} />}
        />
      </Routes>
    </div>
  );
};
