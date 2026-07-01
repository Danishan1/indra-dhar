"use client";
import styles from "../css/FormWrapper.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormComponent } from "@/components/forms";

export function FormWrapper({
  title = "Create Record",
  subtitle = "",
  fields = [],
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  successMessage,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(e);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <FormComponent
        title={title}
        subtitle={subtitle}
        onSubmit={handleSubmit}
        onCancel={onCancel || (() => router.back())}
        loading={loading}
        error={error}
        success={successMessage}
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
      >
        {fields}
      </FormComponent>
    </div>
  );
}
