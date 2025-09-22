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
  const [returnOrders, setReturnOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("incomplete");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { phaseName } = useParams();
  const userPhaseName =
    user?.role.slice(0, 1).toUpperCase() + user?.role.slice(1);
  const userRole = user?.role;

  const username = user?.name;
  const fetchData = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        limit: 50,
      };
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await api.get(`/items/get-bulk-items/${phaseName}`, {
        params,
      });

      const data = res.data;
      if (data.success) {
        setCompletedOrders((prev) =>
          append
            ? [...prev, ...data.data.completedOrders]
            : data.data.completedOrders
        );
        setIncompleteOrders((prev) =>
          append
            ? [...prev, ...data.data.incompleteOrders]
            : data.data.incompleteOrders
        );
        setReturnOrders((prev) =>
          append ? [...prev, ...data.data.returnOrders] : data.data.returnOrders
        );
        setHasMore(data.pagination.hasMore);
      } else {
        console.error("API error:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phaseName) {
      fetchData(1, false);
    }
  }, [phaseName, startDate, endDate]);

  const loadMore = () => {
    const nextPage = page + 1;
    fetchData(nextPage, true);
    setPage(nextPage);
  };

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

  // const handleView = (id) => {
  //   navigate(`/user/view-item/${id}`);
  // };

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

  const notKoraAcceptFor = [
    "Paint",
    "Finishing",
    "Export",
    "Store",
    "Temporary-stock",
    "Defective-space",
    "E-commerce",
  ];

  const renderRow = (item, isCompleted) => (
    <tr key={item._id}>
      <td>
        {item.image !== "none" && (
          <img className={styles.img} src={`${item.image}`} />
        )}
      </td>
      <td>{item.itemName || "N/A"}</td>
      <td>{item.vendorName || "—"}</td>
      <td>{item.buyerName || "—"}</td>
      <td>{item.size || "—"}</td>
      <td>{item.weight || "—"}</td>
      <td>{item.quantity}</td>
      <td>{item.pendingItemCount}</td>
      <td>{item.completedItemCount}</td>
      <td>{item.status}</td>
      <td>{item.from || "-"}</td>
      <td>{new Date(item.createdAt).toLocaleString()}</td>
      <td>{item.createdBy}</td>
      <td>{item.acceptedBy}</td>
      {(userPhaseName === item.phaseName || userRole === "admin") && (
        <td className={styles.actions}>
          {/* <button onClick={() => handleView(item._id)}>View</button> */}
          <>
            {item.acceptedBy === "Pending" &&
              (!notKoraAcceptFor.includes(userPhaseName) ||
                username !== item.createdBy ||
                userRole === "admin") && (
                <button onClick={() => handleAcceptedBy(item._id)}>
                  Accept
                </button>
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
        </td>
      )}
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
          <th>Size</th>
          <th>weight</th>
          <th>Quantity Recieved</th>
          <th>Balance in Stock</th>
          <th>Sent</th>
          <th>Status</th>
          <th>From</th>
          <th>Created At</th>
          <th>Created By</th>
          <th>Accepted By</th>
          {(userPhaseName === orders[0].phaseName || userRole === "admin") && (
            <th>Actions</th>
          )}
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
            onClick={() => setViewType("complete")}
          >
            Completed Orders
          </button>
        )}
        <button
          className={`${styles.toggleButton} ${
            viewType === "returned" ? styles.active : ""
          }`}
          onClick={() => setViewType("returned")}
        >
          Returned Orders
        </button>

        <div className={styles.filters}>
          <label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <Button variant="primary" onClick={() => fetchData(1, false)}>
            Apply
          </Button>
        </div>

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
          (phaseName === userPhaseName || userRole === "admin") && (
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
            <>
              {renderTable(incompleteOrders, false)}
              {hasMore && <Button onClick={loadMore}>Load More</Button>}
            </>
          ) : (
            <p>No incomplete orders found.</p>
          )}
        </>
      ) : viewType === "complete" ? (
        <>
          <h2>Completed Orders</h2>
          {completedOrders.length > 0 ? (
            <>
              {renderTable(completedOrders, true)}
              {hasMore && <Button onClick={loadMore}>Load More</Button>}
            </>
          ) : (
            <p>No completed orders found.</p>
          )}
        </>
      ) : viewType === "returned" ? (
        <>
          <h2>Returned Orders</h2>
          {returnOrders.length > 0 ? (
            <>
              {renderTable(returnOrders, true)}
              {hasMore && <Button onClick={loadMore}>Load More</Button>}
            </>
          ) : (
            <p>No returned orders found.</p>
          )}
        </>
      ) : (
        <>Not Valid Type : {viewType}</>
      )}
    </div>
  );
};

export default BulkItemsTable;
