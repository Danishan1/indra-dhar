import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export function CreatePhaseForm({ onSuccess }) {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Create New Phase",
    fields: [
      {
        name: "name",
        label: "Phase Name",
        type: "text",
        required: true,
      },
      {
        name: "order",
        label: "Phase Sequence",
        type: "number",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
      },
      {
        name: "users",
        label: "Users",
        type: "multi-dropdown",
        options: [], // will populate dynamically
      },
    ],
  });

  // Fetch dropdown data for users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/admin/users?format=dropdown");
        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "users" ? { ...field, options: data } : field
          ),
        }));
      } catch (err) {
        console.error("Error fetching users:", err);
        addToast("Failed to load users list.", "error");
      }
    };
    fetchUsers();
  }, [addToast]);

  const handleSubmit = async (data) => {
    try {
      // Transform users to array of IDs
      const payload = {
        ...data,
        users: data.users?.map((u) => u.value) || [],
      };

      const { data: res } = await api.post("/admin/phases", payload);
      addToast(res.message || "Phase created successfully.", "success");
      onSuccess?.(res);
      navigate("/admin/view-phase");
    } catch (err) {
      console.error("Error creating phase:", err);
      const message =
        err.response?.data?.error || "An unexpected error occurred.";
      addToast(message, "error"); 
    }
  };

  return (
    <GenericForm
      config={formConfig}
      onSubmit={handleSubmit}
      submitLabel="Create Phase"
    />
  );
}
