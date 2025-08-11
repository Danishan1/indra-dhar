import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export function UpdateUser({ data: user, onSuccess }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Update User",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
      },
      {
        name: "role",
        label: "Role",
        type: "dropdown",
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
        options: [], // populated dynamically
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: phasesRes }, { data: userDataRes }] = await Promise.all([
          api.get("/admin/phases?format=dropdown"),
          api.get(`/admin/users/${user.email}`),
        ]);

        const phases = phasesRes.data,
          userData = userDataRes.data;

        const fieldDefaults = {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phases:
            userData.phases?.map((p) => ({
              label: p.phaseName,
              value: p.phaseId,
            })) || [],
        };

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "phases"
              ? {
                  ...field,
                  options: phases,
                  defaultValue: fieldDefaults.phases,
                }
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

    if (!user) {
      addToast("No user data provided, choose a user to edit", "error");
      navigate("/admin/view-user");
    } else fetchData();
  }, [addToast, navigate, user]);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        phases: data.phases?.map((p) => p.value) || [],
      };

      const { data: res } = await api.put(
        `/admin/users/email/${user.email}`,
        payload
      );
      addToast(res.message || "User updated successfully.", "success");
      onSuccess?.(res);
    } catch (err) {
      console.error("Error updating user:", err);
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
      submitLabel="Update User"
    />
  );
}
