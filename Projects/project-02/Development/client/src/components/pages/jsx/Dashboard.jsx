import { useEffect, useState } from "react";
import styles from "../css/Dashboard.module.css";
import PhaseCard from "../../dashboard/jsx/PhaseCard";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";
import Button from "../../common/jsx/Button";
import io from "socket.io-client"; // Import socket.io-client
import Dropdown from "../../common/jsx/Dropdown";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("1 Month");
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const phaseName = user?.role.slice(0, 1).toUpperCase() + user?.role.slice(1);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await api.get(`/items/dashboard/${timeRange}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:4000"); // Adjust the URL if necessary

    // Listen for phase update events
    socket.on("phaseUpdated", async ({ tenantId }) => {
      // console.log("Phase updated, fetching new data...");
      fetchData(); // Refresh the dashboard data when phase updates
    });

    if (token) fetchData();

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) {
    return <div className={styles.message}>Loading dashboard...</div>;
  }

  if (!data || !data.phases?.length) {
    return <div className={styles.message}>No data available</div>;
  }

  if (!user) {
    // navigate("/login");
    return <>User is not Present</>
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.actionsButtons}>
          {/* {user.role === "kora" && (
            <Button
              variant="primary"
              onClick={() => navigate("/user/create-master")}
            >
              Create Master Data
            </Button>
          )} */}
          <Dropdown
            placeholder={`Time Range : ${timeRange}`}
            items={[
              { label: "2 Year", value: "2 Year" },
              { label: "1 Year", value: "1 Year" },
              { label: "6 Months", value: "6 Months" },
              { label: "3 Months", value: "3 Months" },
              { label: "1 Months", value: "1 Months" },
              { label: "1 Week", value: "1 Week" },
            ]}
            onSelect={(value) => setTimeRange(value.label)}
          />
          <Button
            variant="primary"
            onClick={() => navigate(`/user/view-item-list/${phaseName}`)}
          >
            View Items
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

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

      {/* Phases */}
      <div className={styles.grid}>
        {data.phases.map((phase) => (
          <PhaseCard key={phase.phaseId} phase={phase} />
        ))}
      </div>
    </div>
  );
}
