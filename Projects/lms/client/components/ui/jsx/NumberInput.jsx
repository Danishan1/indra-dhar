"use client";
import React from "react";
import styles from "../css/NumberInput.module.css";
import { TextInput } from "./TextInput";

/**
 * NumberInput Component
 * Used for numeric entries (costs, quantities, hours, etc.)
 */
export function NumberInput({
  label = "Number",
  placeholder = "Enter value",
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  min,
  max,
  step = "any",
  precision = 2,
  showStepper = false,
  ...rest
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    // Allow blank value
    if (val === "") return onChange(e);

    // Parse number safely
    const num = parseFloat(val);
    if (isNaN(num)) return;

    // Limit precision (if applicable)
    const formatted = precision >= 0 ? num.toFixed(precision) : num;

    onChange({
      ...e,
      target: { ...e.target, value: formatted },
    });
  };

  return (
    <div className={styles.numberWrapper}>
      <TextInput
        label={label}
        placeholder={placeholder}
        type="number"
        value={value}
        onChange={handleChange}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={styles.numberInput}
        {...rest}
      />
      {showStepper && (
        <div className={styles.stepper}>
          <button
            type="button"
            onClick={() =>
              onChange({
                target: { value: (parseFloat(value) || 0) + Number(step) },
              })
            }
            className={styles.stepBtn}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={() =>
              onChange({
                target: { value: (parseFloat(value) || 0) - Number(step) },
              })
            }
            className={styles.stepBtn}
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}

/*


import React, { useState } from "react";
import NumberInput from "@/components/ui/NumberInput/NumberInput";

export default function NumberExample() {
  const [quantity, setQuantity] = useState(10.5);

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <NumberInput
        label="Batch Quantity"
        placeholder="Enter quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        step={0.5}
        precision={2}
        showStepper
        helperText="Specify the number of units per batch."
      />
    </div>
  );
}


*/
