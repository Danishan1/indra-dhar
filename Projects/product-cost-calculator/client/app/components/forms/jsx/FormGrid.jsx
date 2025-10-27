"use client";
import React from "react";
import styles from "../css/FormGrid.module.css";

/**
 * FormGrid
 * Props:
 * - columns: number | string ('auto-fit', 'auto-fill', etc.)
 * - gap: string (spacing between items)
 * - minWidth: string (min width for each grid item)
 * - children: ReactNode
 *
 * Example:
 * <FormGrid columns={3} minWidth="220px" gap="1.5rem">...</FormGrid>
 */
export function FormGrid({
  columns = 2,
  gap = "1rem",
  minWidth = "250px",
  children,
}) {
  const gridStyle = {
    "--grid-gap": gap,
    "--min-width": minWidth,
    "--grid-cols":
      typeof columns === "number"
        ? `repeat(${columns}, minmax(var(--min-width), 1fr))`
        : `repeat(${columns}, minmax(var(--min-width), 1fr))`,
  };

  return (
    <div className={styles.formGrid} style={gridStyle}>
      {children}
    </div>
  );
}

/*


"use client";
import React, { useState } from "react";
import FormComponent from "@/components/form/FormComponent/FormComponent";
import FormSection from "@/components/form/FormSection/FormSection";
import FormGrid from "@/components/form/FormGrid/FormGrid";
import TextInput from "@/components/ui/TextInput/TextInput";
import NumberInput from "@/components/ui/NumberInput/NumberInput";
import DateInput from "@/components/ui/DateInput/DateInput";
import RadioGroup from "@/components/ui/RadioGroup/RadioGroup";

export default function OrderForm() {
  const [form, setForm] = useState({
    orderId: "",
    client: "",
    quantity: "",
    deliveryDate: "",
    priority: "normal",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => console.log("Form Data:", form);

  return (
    <FormComponent title="Create New Order" onSubmit={handleSubmit}>
      <FormSection
        title="Order Information"
        description="Basic order tracking details."
      >
        <FormGrid columns={2} minWidth="220px" gap="1.2rem">
          <TextInput
            label="Order ID"
            value={form.orderId}
            onChange={(e) => handleChange("orderId", e.target.value)}
            required
          />
          <TextInput
            label="Client Name"
            value={form.client}
            onChange={(e) => handleChange("client", e.target.value)}
          />
          <NumberInput
            label="Quantity"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <DateInput
            label="Delivery Date"
            value={form.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Priority">
        <RadioGroup
          name="priority"
          label="Order Priority"
          value={form.priority}
          onChange={(val) => handleChange("priority", val)}
          options={[
            { label: "Low", value: "low" },
            { label: "Normal", value: "normal" },
            { label: "High", value: "high" },
          ]}
        />
      </FormSection>
    </FormComponent>
  );
}




*/