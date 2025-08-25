import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";

export function MoveToPhases({ onSuccess }) {
  const { addToast } = useToast();
  const { move, phaseName, bulkId } = useParams();
  const navigate = useNavigate();
  const title =
    move === "move-forward" ? "Move to Next phase" : "Move to other phase";
  const buttonLabel = move === "move-forward" ? "Move to Next Phase" : "Return";

  const isPoPhase = "Po" === phaseName;

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: title,
    fields: [
      ...(move === "move-backward" && phaseName !== "Kora"
        ? [
            {
              name: "list",
              label: "Add Item to Kora",
              type: "dropdown",
              required: true,
              options: [],
            },
          ]
        : []),
      ...(move === "move-forward" && phaseName === "Stock"
        ? [
            {
              name: "dispatchTo",
              label: "Dispach to",
              type: "dropdown",
              required: true,
              options: [
                { label: "E-commerce", value: "E-commerce" },
                { label: "Export", value: "Export" },
              ],
            },
          ]
        : []),
      {
        name: "quantity",
        label: "Quantity",
        type: "text",
        required: true,
      },
      { name: "images", label: "Upload Images", type: "image" },
    ],
  });

  // Fetch dropdown data for phases
  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await api.get(`/items/get-phases-before/${phaseName}`);
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
    if (data?.dispatchTo?.value === "E-commarce") {
      if (parseInt(data.quantity) !== 1) {
        addToast("Quantity must be one for E-commarce Dispatch", "error");
        return;
      }
    }

    try {
      let payload;
      let isFormData = false;

      // Check for image uploads
      const hasImages = data.images && data.images.length > 0;

      if (hasImages) {
        // Build FormData
        payload = new FormData();
        isFormData = true;

        // Manually append fields
        payload.append("phaseName", phaseName);
        payload.append("quantity", data.quantity);
        payload.append("bulkId", bulkId);
        payload.append("type", "quantity");
        payload.append("dispatchTo", data.dispatchTo?.value || "");
        payload.append("toPhase", data?.list?.label || "");

        // Append images
        data.images.forEach((file) => {
          payload.append("images", file);
        });
      } else {
        // Standard JSON payload
        payload = {
          phaseName,
          quantity: data.quantity,
          bulkId,
          type: "quantity",
          dispatchTo: data?.dispatchTo?.value,
        };
      }

      // Choose API route
      const res =
        move === "move-forward"
          ? await api.post("/items/move-forward", payload, {
              headers: isFormData
                ? { "Content-Type": "multipart/form-data" }
                : {},
            })
          : await api.post("/items/move-backward", payload, {
              headers: isFormData
                ? { "Content-Type": "multipart/form-data" }
                : {},
            });

      addToast(res.data.message || "Successfully Moved.", "success");
      onSuccess?.(res.data);
      navigate(isPoPhase ? `/user/view-item-list${phaseName}` : "/user");
    } catch (err) {
      console.error("Error moving item:", err);
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      addToast(message, "error");
    }
  };

  return (
    <GenericForm
      config={formConfig}
      onSubmit={handleSubmit}
      submitLabel={buttonLabel}
    />
  );
}
