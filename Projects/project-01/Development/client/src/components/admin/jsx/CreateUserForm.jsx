import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";

export function CreateUserForm({ onSuccess }) {
  const { addToast } = useToast();

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Create New User",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
      },
      {
        name: "role",
        label: "Role",
        type: "dropdown",
        required: true,
        options: [
          { label: "Admin", value: "admin" },
          { label: "Phase Head", value: "phase_head" },
          { label: "Operator", value: "operator" },
        ],
      },
      {
        name: "phases",
        label: "Phases",
        type: "dropdown",
        options: [], // will populate dynamically
      },
    ],
  });

  // Fetch dropdown data for phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await api.get("/admin/phases?format=dropdown");
        const data = response.data.data;

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "phases" ? { ...field, options: data } : field
          ),
        }));
      } catch (err) {
        console.error("Error fetching phases:", err);
        addToast("Failed to load phases list.", "error");
      }
    };
    fetchPhases();
  }, [addToast]);

  const handleSubmit = async (data) => {
    try {
      // Transform phases to array of IDs

      const payload = {
        ...data,
        // phases: data.phases?.map((p) => p.value) || [],
        phases: [data.phases.value],
        role: data.role.value,
      };
      console.log("Form data before submission:", payload);

      const { data: res } = await api.post("/admin/users", payload);
      addToast(res.message || "User created successfully.", "success");
      onSuccess?.(res);
      navigate("/admin/view-users");
    } catch (err) {
      console.error("Error creating user:", err);
      const message =
        err.response?.data?.error || "An unexpected error occurred.";
      addToast(message, "error");
    }
  };

  return (
    <GenericForm
      config={formConfig}
      onSubmit={handleSubmit}
      submitLabel="Create User"
    />
  );
}
