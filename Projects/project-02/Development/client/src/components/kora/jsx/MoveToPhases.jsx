import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "../../common/jsx/ImageGallery";

export function MoveToPhases({ onSuccess }) {
  const { addToast } = useToast();
  const { move, phaseName, bulkId } = useParams();
  const navigate = useNavigate();
  const title =
    move === "move-forward"
      ? "Move to Next phase"
      : "Move to backward (Return)";
  const buttonLabel = move === "move-forward" ? "Move to Next Phase" : "Return";

  const isPoPhase = "Po" === phaseName;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // NEW loading state

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: title,
    fields: [
      ...(move === "move-backward" && phaseName !== "Kora"
        ? [
            {
              name: "list",
              label: "Add Item to",
              type: "dropdown",
              required: true,
              options: [],
            },
          ]
        : []),
      ...(move === "move-forward" && phaseName === "Finishing"
        ? [
            {
              name: "dispatchTo",
              label: "Move To",
              type: "dropdown",
              required: true,
              options: [
                { label: "Defective-space", value: "Defective-space" },
                { label: "Temporary-stock", value: "Temporary-stock" },
              ],
            },
          ]
        : []),
      ...(move === "move-forward" && phaseName === "Defective-space"
        ? [
            {
              name: "dispatchTo",
              label: "Move To",
              type: "dropdown",
              required: true,
              options: [{ label: "Temporary-stock", value: "Temporary-stock" }],
            },
          ]
        : []),
      ...(move === "move-forward" && phaseName === "Temporary-stock"
        ? [
            {
              name: "dispatchTo",
              label: "Dispach to",
              type: "dropdown",
              required: true,
              options: [
                { label: "Store", value: "Store" },
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
        const response = await api.get(
          `/items/get-phases-before/${phaseName}/${bulkId}`
        );
        const data = response.data.data;

        setImages(data.images);

        setFormConfig((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "list"
              ? {
                  ...field,
                  options: [
                    ...data?.phasesBefore,
                    { label: "Defective-space", value: "Defective-space" },
                  ],
                }
              : field
          ),
        }));
      } catch (err) {
        console.error("Error fetching phases:", err);
        addToast("Failed to load phases list.", "error");
      }
    };
    fetchPhases();
  }, [addToast, phaseName, bulkId]);

  const handleSubmit = async (data) => {
    if (loading) return; // prevent double submit
    setLoading(true);

    try {
      if (data?.dispatchTo?.value === "E-commarce") {
        if (parseInt(data.quantity) !== 1) {
          addToast("Quantity must be one for E-commarce Dispatch", "error");
          setLoading(false);
          return;
        }
      }

      let payload;
      let isFormData = false;

      const hasImages = data.images && data.images.length > 0;

      if (hasImages) {
        payload = new FormData();
        isFormData = true;

        payload.append("phaseName", phaseName);
        payload.append("quantity", data.quantity);
        payload.append("bulkId", bulkId);
        payload.append("type", "quantity");
        payload.append("dispatchTo", data.dispatchTo?.value || "");
        payload.append("toPhase", data?.list?.label || "");

        data.images.forEach((file) => {
          payload.append("images", file);
        });
      } else {
        payload = {
          phaseName,
          quantity: data.quantity,
          bulkId,
          type: "quantity",
          dispatchTo: data?.dispatchTo?.value,
          toPhase: data?.list?.label || "",
        };
      }

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
      navigate(isPoPhase ? `/user/view-item-list/${phaseName}` : "/user");
    } catch (err) {
      console.error("Error moving item:", err);
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <ImageGallery images={images} />
      <GenericForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitLabel={loading ? "Processing..." : buttonLabel}
        disabled={loading}
      />
    </div>
  );
}
