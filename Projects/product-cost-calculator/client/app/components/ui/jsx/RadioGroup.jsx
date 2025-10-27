"use client";
import React from "react";
import styles from "../css/RadioGroup.module.css";

/**
 * RadioGroup Component
 * Props:
 * - label: string
 * - options: [{ label: string, value: string }]
 * - name: string (unique for group)
 * - value: string (current selected)
 * - onChange: function
 * - direction: 'row' | 'column'
 * - helperText: string
 * - required, disabled
 */

export function RadioGroup({
  label,
  options = [],
  name,
  value,
  onChange,
  direction = "row",
  helperText,
  required = false,
  disabled = false,
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.groupLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.radioGroup} ${
          direction === "column" ? styles.column : styles.row
        }`}
      >
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`${styles.optionLabel} ${
              disabled ? styles.disabled : ""
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={styles.radioInput}
            />
            <span className={styles.customRadio}></span>
            {opt.label}
          </label>
        ))}
      </div>

      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}

/*

"use client";
import React, { useState } from "react";
import RadioGroup from "@/components/ui/RadioGroup/RadioGroup";

export default function RadioGroupExample() {
  const [unit, setUnit] = useState("kg");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <RadioGroup
        label="Select Unit Type"
        name="unitType"
        value={unit}
        onChange={setUnit}
        options={[
          { label: "Kilogram (kg)", value: "kg" },
          { label: "Gram (g)", value: "g" },
          { label: "Ton (t)", value: "t" },
        ]}
        helperText="Choose the measurement unit for your material."
      />
      <p style={{ marginTop: "1rem" }}>
        Selected Unit: <b>{unit}</b>
      </p>
    </div>
  );
}



*/