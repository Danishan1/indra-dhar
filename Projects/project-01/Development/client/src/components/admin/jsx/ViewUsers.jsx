import React, { useEffect, useState } from "react";
import styles from "../css/ViewPhases.module.css";
import GenericTable from "../../common/jsx/GenericTable";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function ViewUsers({ setData }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setPhases(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { Header: "Name", accessor: "name", filter: true },
    { Header: "Email", accessor: "email", filter: true },
    { Header: "Role", accessor: "role", filter: true },
    {
      Header: "Phases",
      accessor: "phases",
      Cell: (row) =>
        row.phases?.length > 0 ? (
          <ul className={styles.userList}>
            {row.phases.map((u, idx) => (
              <li key={idx}>
                <span>{u.phaseName}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span>-</span>
        ),
    },
  ];

  const handleRowClick = (row) => {
    setData(row);
    navigate(`/admin/users/edit`);
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
