"use client";
import React from "react";
import styles from "../css/RangeInput.module.css";

/**
 * Reusable Range Input (Slider)
 * Props:
 * - label: string
 * - value: number
 * - onChange: function
 * - min, max, step: number
 * - showValue: boolean
 * - helperText: string
 * - required, disabled: boolean
 */
export function RangeInput({
  label = "Select Range",
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  helperText,
  required = false,
  disabled = false,
}) {
  const sliderRef = useRef();

  // Dynamically update progress fill
  useEffect(() => {
    if (sliderRef.current) {
      const percent = ((value - min) / (max - min)) * 100;
      sliderRef.current.style.setProperty("--value-percent", percent);
    }
  }, [value, min, max]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        {showValue && <span className={styles.value}>{value}</span>}
      </div>

      <input
        ref={sliderRef}
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
}

/*

"use client";
import React, { useState } from "react";
import RangeInput from "@/components/ui/RangeInput/RangeInput";

export default function RangeInputExample() {
  const [margin, setMargin] = useState(15);

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <RangeInput
        label="Profit Margin (%)"
        value={margin}
        onChange={(e) => setMargin(Number(e.target.value))}
        min={0}
        max={100}
        step={1}
        helperText="Adjust the desired profit margin."
      />
    </div>
  );
}



*/