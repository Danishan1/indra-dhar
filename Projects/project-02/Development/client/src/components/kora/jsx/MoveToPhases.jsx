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

  const [formConfig, setFormConfig] = useState({
    submitVariant: "primary",
    title: title,
    fields: [
      // ...(move === "move-backward" && phaseName !== "Kora"
      //   ? [
      //       {
      //         name: "list",
      //         label: "Add Item to Kora",
      //         type: "dropdown",
      //         required: true,
      //         options: [],
      //       },
      //     ]
      //   : []),
      {
        name: "quantity",
        label: "Quantity",
        type: "text",
        required: true,
      },
    ],
  });

  // // Fetch dropdown data for phases
  // useEffect(() => {
  //   const fetchPhases = async () => {
  //     try {
  //       const response = await api.get(`/items/get-phases-before/${phaseName}`);
  //       const data = response.data.data;

  //       setFormConfig((prev) => ({
  //         ...prev,
  //         fields: prev.fields.map((field) =>
  //           field.name === "list" ? { ...field, options: data } : field
  //         ),
  //       }));
  //     } catch (err) {
  //       console.error("Error fetching phases:", err);
  //       addToast("Failed to load phases list.", "error");
  //     }
  //   };
  //   fetchPhases();
  // }, [addToast]);

  const handleSubmit = async (data) => {
    try {
      const payload = {
        phaseName: phaseName,
        quantity: data.quantity,
        bulkId,
        type: "quantity",
      };

      const { data: res } = await api.post("/items/move-forward", payload);
      addToast(res.message || "Successfully Moved.", "success");
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
      submitLabel={buttonLabel}
    />
  );
}
