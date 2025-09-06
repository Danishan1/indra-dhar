import { useEffect, useState } from "react";
import { api } from "../../../api/api";
import GenericForm from "../../common/jsx/GenericForm";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../css/MoveBulkForward.module.css";
import { baseUrl } from "../../../util/baseUrl";

export function MoveBulkForward({ onSuccess }) {
  const { addToast } = useToast();
  const { phaseName } = useParams();
  const navigate = useNavigate();

  const title1 = "Bulk Move Forwards";
  const buttonLabel1 = "Start Moving Forwards";
  const title2 = "Enter Quantity";
  const buttonLabel2 = "Add to Move Forward List";

  const [data, setData] = useState([]);
  const [renderingData, setRendringData] = useState([]);
  const [isFormOneSubmit, setIsFormOneSubmit] = useState(false);

  const isPoPhase = phaseName === "Po";

  const [formConfig1, setFormConfig1] = useState({
    submitVariant: "primary",
    title: title1,
    fields: [
      {
        name: "list",
        label: "Select SKU's",
        type: "multi-dropdown",
        required: true,
        options: [],
      },
    ],
  });

  const [formConfig2] = useState({
    submitVariant: "primary",
    title: title2,
    fields: [
      ...(phaseName === "Temporary-stock"
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
      ...(move === "move-forward" && phaseName === "Finishing"
        ? [
            {
              name: "dispatchTo",
              label: "Move To",
              type: "dropdown",
              required: true,
              options: [
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
              options: [
                { label: "Defective-space", value: "Defective-space" },
                { label: "Temporary-stock", value: "Temporary-stock" },
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
        const response = await api.get(`/items/get-bulk-items/${phaseName}`);
        const list = response.data.data.incompleteOrders || [];

        const filteredData = list.filter(
          (d) => phaseName === "Po" || d.acceptedBy !== "Pending"
        );
        const final = filteredData.map((d) => ({
          label: d.itemName,
          value: d._id,
        }));

        setData(filteredData);

        setFormConfig1((prev) => ({
          ...prev,
          fields: prev.fields.map((field) =>
            field.name === "list" ? { ...field, options: final } : field
          ),
        }));
      } catch (err) {
        console.error("Error fetching phases:", err);
        addToast("Failed to load phases list.", "error");
      }
    };

    fetchPhases();
  }, [addToast, phaseName]);

  useEffect(() => {
    renderingData.length === 0 &&
      isFormOneSubmit &&
      navigate(isPoPhase ? `/user/view-item-list/${phaseName}` : "/user");
  }, [renderingData]);

  // Step 1 submit
  const handleSubmit1 = async (formValues) => {
    const t = formValues.list.map((t) => t.value);

    setRendringData(data.filter((d) => t.includes(d._id)));
    setIsFormOneSubmit(true);
  };

  // Step 2 submit (single item)
  const handleSubmit = async (formValues, item) => {
    if (formValues?.dispatchTo?.value === "E-commarce") {
      if (parseInt(formValues.quantity) !== 1) {
        addToast("Quantity must be one for E-commarce Dispatch", "error");
        return;
      }
    }

    try {
      let payload;
      let isFormData = false;

      const hasImages = formValues.images && formValues.images.length > 0;

      if (hasImages) {
        payload = new FormData();
        isFormData = true;

        payload.append("phaseName", phaseName);
        payload.append("quantity", formValues.quantity);
        payload.append("bulkId", item._id);
        payload.append("type", "quantity");
        payload.append("dispatchTo", formValues.dispatchTo?.value || "");
        payload.append("toPhase", formValues?.list?.label || "");

        formValues.images.forEach((file) => {
          payload.append("images", file);
        });
      } else {
        payload = {
          phaseName,
          quantity: formValues.quantity,
          bulkId: item._id,
          type: "quantity",
          dispatchTo: formValues?.dispatchTo?.value,
        };
      }

      const res = await api.post("/items/move-forward", payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });

      addToast(res.data.message || "Successfully Moved.", "success");
      onSuccess?.(res.data);
      setRendringData(renderingData.filter((d) => d._id !== item._id));
      // navigate(isPoPhase ? `/user/view-item-list/${phaseName}` : "/user");
    } catch (err) {
      console.error("Error moving item:", err);
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      addToast(message, "error");
    }
  };

  return (
    <div className={styles.moveToForwardsWrapper}>
      {!isFormOneSubmit ? (
        <div className={styles.moveForwardsStep1}>
          <GenericForm
            config={formConfig1}
            onSubmit={handleSubmit1}
            submitLabel={buttonLabel1}
          />
        </div>
      ) : (
        renderingData.map((item) => (
          <div key={item._id} className={styles.moveForwards}>
            <div className={styles.img}>
              {item.image && item.image !== "none" && (
                <img src={`${baseUrl}${item.image}`} alt={item.itemName} />
              )}
            </div>
            <div className={styles.details}>
              <p>Item Name : {item.itemName}</p>
              <p>Pending Quantity : {item.pendingItemCount}</p>
              <GenericForm
                config={formConfig2}
                onSubmit={(formValues) => handleSubmit(formValues, item)}
                submitLabel={buttonLabel2}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
