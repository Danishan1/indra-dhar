import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";

export function AddToKora({ onSuccess }) {
  const { addToast } = useToast();

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: "Add To Kora",
    fields: [
      {
        name: "list",
        label: "Add Item to Kora",
        type: "multi-dropdown",
        required: true,
        options: [],
      },
    ],
  });

  // Fetch dropdown data for phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await api.get("/items");
        const data = response.data.data;

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "list" ? { ...field, options: data } : field
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
      console.log(data);
    //   const { data: res } = await api.post("/admin/users", data);
      addToast(res.message || "User created successfully.", "success");
      onSuccess?.(res);
      navigate("/user");
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
      submitLabel="Add to Kora"
    />
  );
}
