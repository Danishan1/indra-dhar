"use client";
import React from "react";
import styles from "../css/FormActions.module.css";

/**
 * FormActions Component
 * Props:
 * - primaryText: string (default: "Submit")
 * - secondaryText: string (default: "Cancel")
 * - onPrimary: function (required)
 * - onSecondary: function (optional)
 * - align: 'left' | 'right' | 'center' | 'space-between'
 * - loading: boolean (optional)
 * - disablePrimary: boolean
 * - disableSecondary: boolean
 */
export function FormActions({
  primaryText = "Submit",
  secondaryText = "Cancel",
  onPrimary,
  onSecondary,
  align = "right",
  loading = false,
  disablePrimary = false,
  disableSecondary = false,
}) {
  return (
    <div
      className={`${styles.actions} ${
        styles[`align-${align}`] || styles["align-right"]
      }`}
    >
      {secondaryText && (
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={onSecondary}
          disabled={disableSecondary}
        >
          {secondaryText}
        </button>
      )}

      <button
        type="submit"
        className={`${styles.button} ${styles.primary}`}
        onClick={onPrimary}
        disabled={loading || disablePrimary}
      >
        {loading ? "Processing..." : primaryText}
      </button>
    </div>
  );
}

/*

"use client";
import React, { useState } from "react";
import FormComponent from "@/components/form/FormComponent/FormComponent";
import TextInput from "@/components/ui/TextInput/TextInput";
import FormActions from "@/components/form/FormActions/FormActions";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // simulate API call
    setTimeout(() => {
      console.log("Form submitted:", form);
      setLoading(false);
    }, 1500);
  };

  const handleCancel = () => setForm({ email: "", password: "" });

  return (
    <FormComponent title="Login" onSubmit={handleSubmit}>
      <TextInput
        label="Email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <TextInput
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <FormActions
        primaryText="Login"
        secondaryText="Clear"
        onPrimary={handleSubmit}
        onSecondary={handleCancel}
        loading={loading}
        align="right"
      />
    </FormComponent>
  );
}



*/