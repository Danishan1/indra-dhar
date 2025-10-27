"use client";
import React from "react";
import styles from "../css/Textarea.module.css";

/**
 * Reusable Textarea Component
 * Props:
 * - label, placeholder, value, onChange
 * - rows, maxLength, error, helperText, required, disabled
 */

export function Textarea({
  label = "Description",
  placeholder = "Type here...",
  value,
  onChange,
  rows = 4,
  maxLength = 1000,
  error,
  helperText,
  required = false,
  disabled = false,
  ...rest
}) {
  return (
    <div className={styles.textareaWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <textarea
        className={`${styles.textarea} ${error ? styles.error : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        {...rest}
      />

      <div className={styles.footer}>
        {helperText && <p className={styles.helper}>{helperText}</p>}
        {maxLength && (
          <p className={styles.counter}>
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}


/*

import React, { useState } from "react";
import Textarea from "@/components/ui/Textarea/Textarea";

export default function TextareaExample() {
  const [desc, setDesc] = useState("");

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <Textarea
        label="Project Description"
        placeholder="Enter project or cost details here..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={5}
        maxLength={500}
        helperText="Briefly describe the project or batch details."
      />
    </div>
  );
}



*/