import React, { useEffect, useState } from "react";
import styles from "../css/BulkItemsTable.module.css";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../common/jsx/Button";
import { baseUrl } from "../../../util/baseUrl";

const BulkItemsTable = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [incompleteOrders, setIncompleteOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("incomplete"); // "incomplete" or "completed"
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { phaseName } = useParams();
  const userPhaseName =
    user?.role.slice(0, 1).toUpperCase() + user?.role.slice(1);

  const username = user?.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/items/get-bulk-items/${phaseName}`);
        const data = res.data;

        if (data.success) {
          setCompletedOrders(data.data.completedOrders);
          setIncompleteOrders(data.data.incompleteOrders);
        } else {
          console.error("API error:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    phaseName && fetchData();
  }, [phaseName]);

  const handleAcceptedBy = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this item?"
    );

    if (!confirmed) return;
    try {
      const payload = {
        id,
        role: user?.role,
      };
      const res = await api.post(`/items/acceptedby`, payload);
      window.location.reload();
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleView = (id) => {
    navigate(`/user/view-item/${id}`);
  };

  const handleMoveForward = (id) => {
    navigate(`/user/move-forward/${phaseName}/${id}`);
  };

  const handleMoveBackward = (id) => {
    navigate(`/user/move-backward/${phaseName}/${id}`);
  };

  const isButtonRender = (isCompleted, item) =>
    !isCompleted &&
    phaseName !== "E-commerce" &&
    phaseName !== "Export" &&
    (phaseName === "Po" || item.acceptedBy !== "Pending");

  const renderRow = (item, isCompleted) => (
    <tr key={item._id}>
      <td>
        {item.image !== "none" && (
          <img className={styles.img} src={`${baseUrl}${item.image}`} />
        )}
      </td>
      <td>{item.itemName || "N/A"}</td>
      <td>{item.vendorName || "—"}</td>
      <td>{item.buyerName || "—"}</td>
      <td>{item.color || "—"}</td>
      <td>{item.quantity}</td>
      <td>{item.pendingItemCount}</td>
      <td>{item.completedItemCount}</td>
      <td>{item.status}</td>
      <td>{new Date(item.createdAt).toLocaleString()}</td>
      <td>{item.createdBy}</td>
      <td>{item.acceptedBy}</td>
      <td className={styles.actions}>
        <button onClick={() => handleView(item._id)}>View</button>
        {userPhaseName === item.phaseName && (
          <>
            {item.acceptedBy === "Pending" && username !== item.createdBy && (
              <button onClick={() => handleAcceptedBy(item._id)}>Accept</button>
            )}
            {isButtonRender(isCompleted, item) && (
              <>
                <button onClick={() => handleMoveForward(item._id)}>
                  Move Forward
                </button>
                {!["Kora", "Po", "Store"].includes(phaseName) && (
                  <button onClick={() => handleMoveBackward(item._id)}>
                    Move Backward
                  </button>
                )}
              </>
            )}
          </>
        )}
      </td>
    </tr>
  );

  const renderTable = (orders, isCompleted) => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Item Image</th>
          <th>Item Name</th>
          <th>Vendor</th>
          <th>Buyer</th>
          <th>Color</th>
          <th>Quantity Recieved</th>
          <th>Balance in Stock</th>
          <th>Sent Forward</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Created By</th>
          <th>Accepted By</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{orders.map((item) => renderRow(item, isCompleted))}</tbody>
    </table>
  );

  if (loading) return <p>Loading bulk items...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.toggleButtons}>
        {phaseName !== "E-commerce" && phaseName !== "Export" && (
          <button
            className={`${styles.toggleButton} ${
              viewType === "incomplete" ? styles.active : ""
            }`}
            onClick={() => setViewType("incomplete")}
          >
            Incomplete Orders
          </button>
        )}
        {phaseName !== "E-commerce" && phaseName !== "Export" && (
          <button
            className={`${styles.toggleButton} ${
              viewType === "completed" ? styles.active : ""
            }`}
            onClick={() => setViewType("completed")}
          >
            Completed Orders
          </button>
        )}
        <button
          className={`${styles.toggleButton}`}
          onClick={() =>
            navigate(phaseName === "Po" ? "/user/create-po" : "/user")
          }
        >
          {phaseName === "Po" ? "Create New PO" : "Home"}
        </button>

        {phaseName !== "E-commerce" &&
          phaseName !== "Store" &&
          phaseName === userPhaseName && (
            <Button
              variant="primary"
              onClick={() => navigate(`/user/move-bulk/${phaseName}`)}
            >
              Move Bulk Forward
            </Button>
          )}
        {phaseName === "Po" && (
          <>
            <Button
              onClick={() => {
                navigate("/user/create-bulk-po");
              }}
              variant="primary"
            >
              Bulk Upload
            </Button>
            
            <Button onClick={logout} variant="danger">
              Log Out
            </Button>
          </>
        )}
      </div>

      {viewType === "incomplete" ? (
        <>
          <h2>Incomplete Orders</h2>
          {incompleteOrders.length > 0 ? (
            renderTable(incompleteOrders, false)
          ) : (
            <p>No incomplete orders found.</p>
          )}
        </>
      ) : (
        <>
          <h2>Completed Orders</h2>
          {completedOrders.length > 0 ? (
            renderTable(completedOrders, true)
          ) : (
            <p>No completed orders found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BulkItemsTable;
