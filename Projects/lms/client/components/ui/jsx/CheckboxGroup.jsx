"use client";
import React from "react";
import styles from "../css/CheckboxGroup.module.css";

/**
 * Reusable Checkbox Group Component
 * Props:
 * - label: group title
 * - options: array of { label, value }
 * - selected: array of selected values
 * - onChange: callback when any checkbox changes
 * - helperText: optional info below the group
 */

export function CheckboxGroup({
  label = "Select Options",
  options = [],
  selected = [],
  onChange,
  helperText,
  required = false,
}) {
  const handleChange = (value) => {
    const updated = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
  };

  return (
    <div className={styles.groupWrapper}>
      {label && (
        <label className={styles.groupLabel}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.checkboxes}>
        {options.map((opt) => (
          <label key={opt.value} className={styles.checkboxItem}>
            <input
              type="checkbox"
              value={opt.value}
              checked={selected.includes(opt.value)}
              onChange={() => handleChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {helperText && <p className={styles.helper}>{helperText}</p>}
    </div>
  );
}


/*

"use client";
import React, { useState } from "react";
import CheckboxGroup from "@/components/ui/CheckboxGroup/CheckboxGroup";

export default function CheckboxGroupExample() {
  const [selected, setSelected] = useState(["material"]);

  const options = [
    { label: "Material", value: "material" },
    { label: "Labor", value: "labor" },
    { label: "Overhead", value: "overhead" },
    { label: "Transport", value: "transport" },
  ];

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <CheckboxGroup
        label="Select Cost Components"
        options={options}
        selected={selected}
        onChange={setSelected}
        helperText="You can select multiple cost types."
      />
      <p style={{ marginTop: "1rem" }}>
        Selected: {selected.length ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}



*/