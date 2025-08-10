import { useNavigate } from "react-router-dom";
import styles from "../css/ErrorPage.module.css";

export default function ErrorPage({ status = 404, message = "Page Not Found" }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.status}>{status}</div>
      <div className={styles.message}>{message}</div>
      <button className={styles.button} onClick={() => navigate("/")}>
        Go Back Home
      </button>
    </div>
  );
}
