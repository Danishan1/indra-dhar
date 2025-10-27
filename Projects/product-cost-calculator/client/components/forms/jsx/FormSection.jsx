"use client";
import React from "react";
import styles from "../css/FormSection.module.css";

/**
 * FormSection — groups related fields within a form
 * Props:
 * - title: string (section heading)
 * - description: string (optional short note)
 * - children: ReactNode (input fields or custom components)
 * - columns: number (default 1, layout columns)
 */
export function FormSection({
  title,
  description,
  children,
  columns = 1,
}) {
  return (
    <div className={styles.section}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      )}

      <div
        className={`${styles.body} ${
          columns === 2 ? styles.twoCols : styles.oneCol
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/*

"use client";
import React, { useState } from "react";
import FormComponent from "@/components/form/FormComponent/FormComponent";
import FormSection from "@/components/form/FormSection/FormSection";
import TextInput from "@/components/ui/TextInput/TextInput";
import NumberInput from "@/components/ui/NumberInput/NumberInput";
import EmailInput from "@/components/ui/EmailInput/EmailInput";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    email: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    console.log("Submitting form:", form);
  };

  return (
    <FormComponent
      title="Add New Product"
      description="Provide basic details for the product."
      onSubmit={handleSubmit}
    >
      <FormSection
        title="Basic Details"
        description="Information used for identification and tracking."
        columns={2}
      >
        <TextInput
          label="Product Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <TextInput
          label="SKU Code"
          value={form.sku}
          onChange={(e) => handleChange("sku", e.target.value)}
        />
      </FormSection>

      <FormSection
        title="Pricing"
        description="Set retail and base pricing."
        columns={2}
      >
        <NumberInput
          label="Price"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <EmailInput
          label="Contact Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </FormSection>
    </FormComponent>
  );
}


*/