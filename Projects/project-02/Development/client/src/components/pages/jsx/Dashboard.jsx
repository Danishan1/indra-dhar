import { useEffect, useState } from "react";
import styles from "../css/Dashboard.module.css";
import PhaseCard from "../../dashboard/jsx/PhaseCard";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../api/api";
import ActionButtons from "../../common/jsx/ActionButtons";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/items/dashboard");
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

  if (!data || !data.phases?.length) {
    return <div className={styles.message}>No data available</div>;
  }

  const handleAction = (action) => {
    const base = "/user";
    navigate(`${base}/${action}`);
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* User Info */}
      <div className={styles.userInfo}>
        <p>
          <strong>Name:</strong> {data.user.name}
        </p>
        <p>
          <strong>Role:</strong> {data.user.role}
        </p>
        <p>
          <strong>Email:</strong> {data.user.email}
        </p>
        <p>
          <strong>Tenant:</strong> {data.user.tenantName}
        </p>
      </div>

      <ActionButtons onAction={handleAction} />

      {/* Phases */}
      <div className={styles.grid}>
        {data.phases.map((phase) => (
          <PhaseCard key={phase.phaseId} phase={phase} />
        ))}
      </div>
    </div>
  );
}
