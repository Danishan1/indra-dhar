"use client";
import styles from "../css/DataDetails.module.css";

/**
 * Converts snake_case, kebab-case, or camelCase to "Title Case"
 */
const formatKey = (key) => {
  return key
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
};

const renderValue = (value) => {
  if (value === null || value === undefined) {
    return <span className={styles.null}>—</span>;
  }

  // Nested object
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      <div className={styles.nested}>
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className={styles.row}>
            <div className={styles.key}>{formatKey(key)}</div>
            <div className={styles.value}>{renderValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    return (
      <div className={styles.nested}>
        {value.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.key}>#{index + 1}</div>
            <div className={styles.value}>{renderValue(item)}</div>
          </div>
        ))}
      </div>
    );
  }

  // URL
  if (typeof value === "string" && /^https?:\/\//.test(value)) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
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
          <div className={styles.value}>{renderValue(value)}</div>
        </div>
      ))}
    </div>
  );
}
