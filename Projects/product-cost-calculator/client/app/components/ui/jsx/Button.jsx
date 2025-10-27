"use client";
import React from "react";
import styles from "../css/Button.module.css";
import clsx from "clsx";

/**
 * Reusable Button Component
 * @param {string} variant - "primary" | "secondary" | "outline" | "text"
 * @param {string} size - "sm" | "md" | "lg"
 * @param {boolean} fullWidth - expands to full container width
 * @param {boolean} disabled - disables interaction
 * @param {function} onClick - click handler
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  ...rest
}) {
  const buttonClass = clsx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled
  );

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

/*

import Button from "@/components/ui/Button/Button";

export default function Page() {
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "2rem" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
      <Button variant="primary" size="lg" fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}


*/
