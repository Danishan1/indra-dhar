import { useState } from "react";
import styles from "../css/Input.module.css";

export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={styles.inputGroup}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
