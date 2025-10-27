"use client";
import React from "react";
import styles from "../css/Switch.module.css";

/**
 * Reusable Switch Component
 * Props:
 * - label, checked, onChange
 * - helperText, disabled
 */

export function SwitchInput({
  label = "Enable Feature",
  checked = false,
  onChange,
  helperText,
  disabled = false,
  required = false,
  ...rest
}) {
  return (
    <div className={styles.switchWrapper}>
      <label className={styles.container}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          {...rest}
        />
        <span className={styles.slider}></span>
      </label>

      <div className={styles.textBlock}>
        {label && (
          <p className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </p>
        )}
        {helperText && <p className={styles.helper}>{helperText}</p>}
      </div>
    </div>
  );
}


/*

import React, { useState } from "react";
import Switch from "@/components/ui/Switch/Switch";

export default function SwitchExample() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <Switch
        label="Active Status"
        checked={isActive}
        onChange={setIsActive}
        helperText="Toggle to activate or deactivate this item."
      />
      <p style={{ marginTop: "1rem" }}>
        Current status: <b>{isActive ? "Active" : "Inactive"}</b>
      </p>
    </div>
  );
}


*/