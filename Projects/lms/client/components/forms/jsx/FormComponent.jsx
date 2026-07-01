"use client";
import React from "react";
import styles from "../css/FormComponent.module.css";

/**
 * FormComponent — reusable form wrapper
 * Props:
 * - title: string
 * - description: string
 * - onSubmit: function
 * - onCancel: function (optional)
 * - children: ReactNode (input fields, etc.)
 * - loading: boolean
 * - error: string
 * - success: string
 * - actions: boolean (whether to show submit/cancel)
 */

export function FormComponent({
  title,
  description,
  onSubmit,
  onCancel,
  children,
  loading = false,
  error,
  success,
  actions = true,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) {
  return (
    <form
      className={styles.formContainer}
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading && onSubmit) onSubmit(e);
      }}
    >
      {/* Header Section */}
      {(title || description) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {/* Form Fields */}
      <div className={styles.formBody}>{children}</div>

      {/* Status Messages */}
      {error && <p className={`${styles.error} ${styles.error}`}>{error}</p>}
      {success && (
        <p className={`${styles.message} ${styles.success}`}>{success}</p>
      )}

      {/* Action Buttons */}
      {actions && (
        <div className={styles.actions}>
          <button
            type="submit"
            disabled={loading}
            className={styles.primaryBtn}
          >
            {loading ? "Saving..." : submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

/*


"use client";
import React, { useState } from "react";
import FormComponent from "@/components/form/FormComponent/FormComponent";
import TextInput from "@/components/ui/TextInput/TextInput";
import EmailInput from "@/components/ui/EmailInput/EmailInput";

export default function ExampleForm() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const handleSubmit = async () => {
    setStatus({ loading: true });
    setTimeout(() => {
      setStatus({ loading: false, success: "Form submitted successfully!" });
    }, 1500);
  };

  return (
    <div style={{ margin: "2rem auto", display: "flex", justifyContent: "center" }}>
      <FormComponent
        title="User Registration"
        description="Add a new user to the system."
        onSubmit={handleSubmit}
        loading={status.loading}
        error={status.error}
        success={status.success}
      >
        <TextInput
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <EmailInput
          label="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </FormComponent>
    </div>
  );
}



*/
