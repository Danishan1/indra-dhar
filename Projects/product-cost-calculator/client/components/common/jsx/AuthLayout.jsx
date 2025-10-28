import styles from "../css/AuthLayout.module.css";

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
