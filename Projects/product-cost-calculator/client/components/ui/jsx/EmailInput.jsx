"use client";
import React, { useState, useEffect } from "react";
import styles from "../css/EmailInput.module.css";
import { Mail } from "lucide-react";
import TextInput from "./TextInput";

/**
 * EmailInput Component
 * Built on top of TextInput with built-in format validation.
 */
export function EmailInput({
  label = "Email",
  placeholder = "Enter your email address",
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  validateOnChange = true,
  ...rest
}) {
  const [emailError, setEmailError] = useState("");

  // simple email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (validateOnChange && value) {
      if (!validateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [value, validateOnChange]);

  return (
    <div className={styles.emailWrapper}>
      <TextInput
        type="email"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error || emailError}
        helperText={helperText}
        required={required}
        disabled={disabled}
        iconLeft={<Mail size={18} className={styles.icon} />}
        {...rest}
      />
    </div>
  );
}


/*


import React, { useState } from "react";
import EmailInput from "@/components/ui/EmailInput/EmailInput";

export default function EmailExample() {
  const [email, setEmail] = useState("");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <EmailInput
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        helperText="We'll never share your email."
      />
    </div>
  );
}




*/