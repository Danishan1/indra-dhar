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
    ],
  };

  const handleSubmit = async (data) => {
    try {
      const { data: res } = await api.post("/items", data);
      addToast(res.message || "User created successfully.", "success");
      onSuccess?.(res);
      navigate("/user");
    } catch (err) {
      const data = err.response?.data;

      if (data?.success === "joi") {
        data.message.map((err) =>
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
