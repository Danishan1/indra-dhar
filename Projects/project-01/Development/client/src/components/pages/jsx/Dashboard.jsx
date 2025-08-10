import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Dashboard.module.css";
import PhaseCard from "../../dashboard/jsx/PhaseCard";
import { useAuth } from "../../../context/AuthContext";
import { baseUrl } from "../../../util/baseUrl";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {

      try {
        const res = await axios.get(`${baseUrl}/items/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Dashboard data:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) {
    return <div className={styles.message}>Loading dashboard...</div>;
  }

  if (!data.length) {
    return <div className={styles.message}>No data available</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.grid}>
        {data.map((phase) => (
          <PhaseCard key={phase.phaseId} phase={phase} />
        ))}
      </div>
    </div>
  );
}
