import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export function UpdatePhase({ data: phase, onSuccess }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Update Phase",
    fields: [
      {
        name: "name",
        label: "Phase Name",
        type: "text",
      },
      {
        name: "order",
        label: "Phase Sequence",
        type: "number",
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
        options: [], // populated dynamically
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  // Fetch users list & phase details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: users }, { data: phaseData }] = await Promise.all([
          api.get("/admin/users?format=dropdown"),
          api.get(`/admin/phases/${phase.value}`),
        ]);

        const fieldDefaults = {
          name: phaseData.label, // API "label" → form "name"
          order: phaseData.order, // API "order" → form "order"
          description: phaseData.description, // API "description" → form "description"
          users:
            phaseData.users?.map((u) => ({
              label: u.name,
              value: u._id,
            })) || [],
        };

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "users"
              ? { ...field, options: users, defaultValue: fieldDefaults.users }
              : { ...field, defaultValue: fieldDefaults[field.name] }
          ),
        }));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching update form data:", err);
        addToast("Failed to load form data.", "error");
        setLoading(false);
      }
    };

    if (!phase) {
      addToast("No phase data provided, Choose a Phase to Edit", "error");
      navigate("/admin/view-phase");
    } else phase && fetchData();
  }, [addToast]);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        users: data.users?.map((u) => u.value) || [],
      };

      const { data: res } = await api.put(
        `/admin/phases/${phase.value}`,
        payload
      );
      addToast(res.message || "Phase updated successfully.", "success");
      onSuccess?.(res);
    } catch (err) {
      console.error("Error updating phase:", err);
      const message =
        err.response?.data?.error || "An unexpected error occurred.";
      addToast(message, "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <GenericForm
      config={formConfig}
      onSubmit={handleSubmit}
      submitLabel="Update Phase"
    />
  );
}
