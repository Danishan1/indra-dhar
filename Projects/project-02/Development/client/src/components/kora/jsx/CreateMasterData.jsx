import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export function CreateMasterData({ onSuccess }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const formConfig = {
    submitVariant: "primary",
    title: "Create Master Data",
    fields: [
      {
        name: "name",
        label: "Product Name",
        type: "text",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        required: true,
      },
      {
        name: "code",
        label: "Code",
        type: "text",
        required: true,
      },
      {
        name: "buyerName",
        label: "Buyer Name",
        type: "text",
        required: true,
      },
      {
        name: "vendorName",
        label: "Vendor Name",
        type: "text",
        required: true,
      },
      {
        name: "color",
        label: "Finishing Color",
        type: "text",
        required: true,
      },
      {
        name: "items",
        label: "No. of Items",
        type: "text",
        required: true,
      },
      { name: "images", label: "Upload Images", type: "image" },
    ],
  };

  const handleSubmit = async (data) => {
    try {
      let payload;

      // Check if images are present and of FileList or array of Files
      if (data.images && data.images.length > 0) {
        payload = new FormData();

        // Append all fields
        Object.entries(data).forEach(([key, value]) => {
          if (key === "images" && Array.isArray(value)) {
            value.forEach((file) => {
              payload.append("images", file);
            });
          } else {
            payload.append(key, value);
          }
        });
      } else {
        payload = data; // fallback for non-image forms
      }

      const { data: res } = await api.post("/items", payload, {
        headers:
          payload instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      });

      addToast(res.message || "User created successfully.", "success");
      onSuccess?.(res);
      navigate("/user/view-item-list/Po");
    } catch (err) {
      const data = err.response?.data;

      if (data?.success === "joi") {
        data.message.forEach((err) =>
          addToast(`${err.field}: ${err.message}`, "error")
        );
      }

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
