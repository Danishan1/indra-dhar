"use client";
import React from "react";
import styles from "../css/DateInput.module.css";
import { Calendar } from "lucide-react";

/**
 * Reusable DateInput Component
 * Props:
 * - label: string
 * - value: string (YYYY-MM-DD)
 * - onChange: function
 * - min, max: string (YYYY-MM-DD)
 * - helperText: string
 * - required, disabled: boolean
 */

export function DateInput({
  label = "Select Date",
  value,
  onChange,
  min,
  max,
  helperText,
  required = false,
  disabled = false,
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <Calendar className={styles.icon} size={18} />
        <input
          type="date"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          className={styles.input}
        />
      </div>

      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}


/**

"use client";
import React, { useState } from "react";
import DateInput from "@/components/ui/DateInput/DateInput";

export default function DateInputExample() {
  const [date, setDate] = useState("");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <DateInput
        label="Purchase Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min="2020-01-01"
        max="2030-12-31"
        required
        helperText="Select the date of purchase or record creation."
      />
      {date && (
        <p style={{ marginTop: "1rem" }}>
          Selected Date: <b>{date}</b>
        </p>
      )}
    </div>
  );
}



 */