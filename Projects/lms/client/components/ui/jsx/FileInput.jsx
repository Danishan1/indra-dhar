"use client";
import React, { useRef } from "react";
import styles from "../css/FileInput.module.css";

/**
 * Reusable File Input Component
 * Props:
 * - label: string
 * - onChange: function(File | FileList)
 * - accept: string (e.g. ".pdf,.jpg,.png")
 * - multiple: boolean
 * - helperText: string
 * - required, disabled
 */

export function FileInput({
  label = "Upload File",
  onChange,
  accept = "*/*",
  multiple = false,
  helperText,
  required = false,
  disabled = false,
}) {
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (multiple) {
      onChange(Array.from(files));
    } else {
      onChange(files[0]);
    }
  };

  const triggerUpload = () => {
    if (!disabled && fileRef.current) fileRef.current.click();
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.dropZone} ${disabled ? styles.disabled : ""}`}
        onClick={triggerUpload}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className={styles.hiddenInput}
          onChange={handleFileChange}
          disabled={disabled}
        />

        <div className={styles.textArea}>
          <p className={styles.uploadText}>
            Click to browse or drag & drop your file(s)
          </p>
          <p className={styles.helperText}>
            {helperText || `Accepted formats: ${accept}`}
          </p>
        </div>
      </div>
    </div>
  );
}


/*

"use client";
import React, { useState } from "react";
import FileInput from "@/components/ui/FileInput/FileInput";

export default function FileInputExample() {
  const [file, setFile] = useState(null);

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <FileInput
        label="Upload Vendor Invoice"
        accept=".pdf,.jpg,.png"
        onChange={setFile}
        helperText="Attach supporting invoice or document."
      />
      {file && (
        <p style={{ marginTop: "1rem" }}>
          Selected file: <b>{file.name}</b>
        </p>
      )}
    </div>
  );
}


*/