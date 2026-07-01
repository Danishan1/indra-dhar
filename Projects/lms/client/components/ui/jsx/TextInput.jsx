"use client";
import React from "react";
import styles from "../css/TextInput.module.css";
import clsx from "clsx";

/**
 * Reusable Text Input Component
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} type - Input type ("text" | "email" | "number" | etc.)
 * @param {boolean} required - Marks field as required
 * @param {string} error - Error message
 * @param {string} helperText - Optional helper message
 * @param {ReactNode} iconLeft - Optional icon on left
 * @param {ReactNode} iconRight - Optional icon on right
 */
export function TextInput({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  required = false,
  error,
  helperText,
  iconLeft,
  iconRight,
  disabled = false,
  ...rest
}) {
  const inputClass = clsx(
    styles.inputField,
    error && styles.errorInput,
    disabled && styles.disabled,
    iconLeft && styles.withIconLeft,
    iconRight && styles.withIconRight
  );

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputContainer}>
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}

        <input
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...rest}
        />

        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>

      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}


/*

import TextInput from "@/components/ui/TextInput/TextInput";

export default function ExampleForm() {
  const [email, setEmail] = React.useState("");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <TextInput
        label="Email Address"
        placeholder="you@example.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        helperText="We'll never share your email."
      />

      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error="This field is required."
      />
    </div>
  );
}



*/