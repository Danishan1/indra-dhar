import React, { useEffect, useState } from "react";
import styles from "../css/ViewPhases.module.css";
import GenericTable from "../../common/jsx/GenericTable";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function ViewPhases({ setData }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPhases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/phases");
      setPhases(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const columns = [
    { Header: "Name", accessor: "label", filter: true },
    { Header: "Order", accessor: "order", filter: true },
    {
      Header: "Users",
      accessor: "users",
      Cell: (row) =>
        row.users?.length > 0 ? (
          <ul className={styles.userList}>
            {row.users.map((u, idx) => (
              <li key={idx}>
                <span>{u.name}</span> <small>({u.email})</small>
              </li>
            ))}
          </ul>
        ) : (
          <span>No Users</span>
        ),
    },
  ];

  const handleRowClick = (row) => {
    setData(row);
    navigate(`/admin/phases/edit`);
  };

  if (loading) return <p>Loading phases...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Phases</h2>
      <GenericTable
        columns={columns}
        data={phases}
        searchPlaceholder="Search phases..."
        onClickRow={handleRowClick}
      />
    </div>
  );
}
