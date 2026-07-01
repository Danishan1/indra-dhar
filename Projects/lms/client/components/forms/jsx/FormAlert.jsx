"use client";
import React from "react";
import styles from "../css/FormAlert.module.css";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

/**
 * FormAlert Component
 * Props:
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - message: string
 * - onClose: function (optional)
 * - show: boolean (optional)
 */
export function FormAlert({ type = "info", message, onClose, show = true }) {
  if (!show || !message) return null;

  const iconMap = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.message}>{message}</div>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Close alert">
          <X size={16} />
        </button>
      )}
    </div>
  );
}


/*

"use client";
import React, { useState } from "react";
import FormComponent from "@/components/form/FormComponent/FormComponent";
import TextInput from "@/components/ui/TextInput/TextInput";
import FormActions from "@/components/form/FormActions/FormActions";
import FormAlert from "@/components/form/FormAlert/FormAlert";

export default function ExampleForm() {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert({ type: "success", message: "Data saved successfully!" });
  };

  return (
    <FormComponent title="Demo Form" onSubmit={handleSubmit}>
      {alert.message && (
        <FormAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({})}
        />
      )}
      <TextInput label="Name" placeholder="Enter name" />
      <FormActions primaryText="Save" onPrimary={handleSubmit} />
    </FormComponent>
  );
}


*/