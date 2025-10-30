"use client";
import styles from "../css/DataDetails.module.css";

/**
 * Converts snake_case, kebab-case, or camelCase to "Title Case"
 * e.g. "vendor_uuid" → "Vendor Uuid"
 */
const formatKey = (key) => {
  return key
    .replace(/[_-]/g, " ") // replace _ or - with space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → camel Case
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim()
    .replace(
      /\w\S*/g,
      (
        txt // Title Case each word
      ) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

export function DataDetails({ data = {} }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className={styles.empty}>No data available.</p>;
  }

  return (
    <div className={styles.detailsContainer}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={styles.row}>
          <div className={styles.key}>{formatKey(key)}</div>
          <div className={styles.value}>
            {typeof value === "string" && value.startsWith("http") ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            ) : (
              String(value)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
