"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "../css/Select.module.css";
import { ChevronDown, Check } from "lucide-react";

/**
 * Reusable Select / Dropdown component
 * Props:
 * - label, options, value, onChange
 * - placeholder, error, helperText, disabled
 */

export function SelectInput({
  label = "Select Option",
  options = [],
  value,
  onChange,
  placeholder = "Choose...",
  error,
  helperText,
  disabled = false,
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleToggle = () => {
    if (!disabled) setOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    onChange({ target: { value: option.value } });
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.selectWrapper} ref={ref}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.selectBox} ${open ? styles.open : ""} ${
          disabled ? styles.disabled : ""
        } ${error ? styles.error : ""}`}
        onClick={handleToggle}
        tabIndex={0}
      >
        <span className={value ? styles.selected : styles.placeholder}>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.icon} ${open ? styles.rotate : ""}`}
        />
      </div>

      {open && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.active : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
              {value === option.value && (
                <Check size={16} className={styles.checkIcon} />
              )}
            </li>
          ))}
          {options.length === 0 && (
            <li className={styles.noOption}>No options available</li>
          )}
        </ul>
      )}

      {helperText && <p className={styles.helper}>{helperText}</p>}
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}


/*

import React, { useState } from "react";
import Select from "@/components/ui/Select/Select";

export default function SelectExample() {
  const [unit, setUnit] = useState("");

  const unitOptions = [
    { value: "kg", label: "Kilogram" },
    { value: "ltr", label: "Litre" },
    { value: "pcs", label: "Pieces" },
  ];

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <Select
        label="Unit Type"
        placeholder="Select unit"
        options={unitOptions}
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        helperText="Select the measurement unit for this material."
        required
      />
    </div>
  );
}



*/