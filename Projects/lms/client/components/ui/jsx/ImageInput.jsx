import React, { useState, useRef } from "react";
import clsx from "clsx";
import styles from "../css/ImageInput.module.css";

/**
 * Props
 * - onChange(file | File[]) => void
 * - accept (string) default: "image/*"
 * - multiple (bool) default: false
 * - maxSize (number) bytes, optional
 * - label (string) optional
 * - showPreview (bool) default: true
 */
export default function ImageInput({
  onChange,
  accept = "image/*",
  multiple = false,
  maxSize,
  label = "Upload image",
  showPreview = true,
}) {
  const [previews, setPreviews] = useState([]); // array of { url, name, size }
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    setError("");
    const files = Array.from(fileList || []);

    if (maxSize) {
      const tooLarge = files.find((f) => f.size > maxSize);
      if (tooLarge) {
        setError(
          `File "${tooLarge.name}" exceeds ${Math.round(maxSize / 1024)} KB`
        );
        return;
      }
    }

    const filePreviews = files.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));

    setPreviews(filePreviews);

    onChange && onChange(multiple ? files : files[0] || null);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleClear = () => {
    // Revoke object URLs
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange && onChange(multiple ? [] : null);
  };

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.controls}>
        <input
          ref={inputRef}
          className={styles.fileInput}
          type="file"
          accept={accept}
          capture={accept === "image/*" ? "environment" : undefined} // hint to mobile to use camera
          multiple={multiple}
          onChange={handleChange}
        />

        <button
          type="button"
          className={clsx(styles.browseButton)}
          onClick={() => inputRef.current?.click()}
        >
          Choose Image
        </button>

        {previews.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showPreview && previews.length > 0 && (
        <div className={styles.previewGrid}>
          {previews.map((p, i) => (
            <div className={styles.previewItem} key={i}>
              <img src={p.url} alt={p.name} className={styles.previewImage} />
              {/* <div className={styles.previewMeta}>
                <span className={styles.previewName}>{p.name}</span>
                <span className={styles.previewSize}>
                  {Math.round(p.size / 1024)} KB
                </span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
