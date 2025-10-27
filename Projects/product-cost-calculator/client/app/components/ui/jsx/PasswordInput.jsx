"use client";
import React, { useState } from "react";
import styles from "..css/PasswordInput.module.css";
import { Eye, EyeOff } from "lucide-react";
import TextInput from "./TextInput";

/**
 * Password Input Component
 * Extends TextInput with visibility toggle
 */
export function PasswordInput({
  label = "Password",
  placeholder = "Enter your password",
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.passwordWrapper}>
      <TextInput
        label={label}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        iconRight={
          <button
            type="button"
            onClick={toggleVisibility}
            className={styles.toggleBtn}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={18} className={styles.icon} />
            ) : (
              <Eye size={18} className={styles.icon} />
            )}
          </button>
        }
        {...rest}
      />
    </div>
  );
}


/*

import React, { useState } from "react";
import PasswordInput from "@/components/ui/PasswordInput/PasswordInput";

export default function AuthExample() {
  const [password, setPassword] = useState("");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <PasswordInput
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        helperText="Use at least 8 characters."
      />
    </div>
  );
}




*/