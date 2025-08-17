import React, { useEffect, useState } from "react";
import styles from "../css/BulkItemDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { useToast } from "../../../context/ToastContext";
import Button from "../../common/jsx/Button";
import { useAuth } from "../../../context/AuthContext";

export const BulkItemDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bulkId } = useParams();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBulkItem = async () => {
      try {
        const res = await api.get(`/items/${bulkId}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load bulk item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBulkItem();
  }, [bulkId]);

  if (!user) return <></>;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied: ${text}`, "success");
  };

  const handleExport = (type) => {
    let itemsToExport = [];

    if (type === "pending") {
      itemsToExport = data.pendingItems;
    } else if (type === "completed") {
      itemsToExport = data.completedItems;
    } else {
      itemsToExport = [...data.pendingItems, ...data.completedItems];
    }

    if (!itemsToExport || itemsToExport.length === 0) {
      addToast("No items to export", "warning");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," + ["Item ID", ...itemsToExport].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `bulk-${type}-items-${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return <div className={styles.error}>Failed to load data.</div>;

  const { bulkItem, pendingItems, completedItems } = data;

  return (
    <div className={styles.bulkItemDetails}>
      <div className={styles.container}>
        <h2 className={styles.title}>Bulk Item Details</h2>

        <div className={styles.bulkInfo}>
          <p>
            <strong>Status:</strong> {bulkItem.status}
          </p>
          <p>
            <strong>Phase ID:</strong> {bulkItem.phaseId}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(bulkItem.createdAt).toLocaleString()}
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.buttons}>
            <Button onClick={() => handleExport("pending")}>
              CSV - Pending
            </Button>
            <Button onClick={() => handleExport("completed")}>
              CSV - Completed
            </Button>
            <Button onClick={() => handleExport("all")}>CSV - All</Button>

            <Button
              onClick={() => {
                navigate("/user/");
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => {
                navigate("/user/view-items");
              }}
            >
              List
            </Button>
          </div>
          <h3>
            {["export", "e-commerce"].includes(user.role) ? "Dispach IDs" : "Pending Items"}
          </h3>
          <div className={styles.idList}>
            {pendingItems.length > 0 ? (
              pendingItems.map((id) => (
                <div
                  key={id}
                  className={styles.idBox}
                  onClick={() => copyToClipboard(id)}
                  title="Click to copy"
                >
                  {id}
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No pending items.</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          {!["export", "e-commerce"].includes(user.role) && (
            <h3>Completed Items</h3>
          )}
          <div className={styles.idList}>
            {completedItems.length > 0 ? (
              completedItems.map((id) => (
                <div
                  key={id}
                  className={styles.idBox}
                  onClick={() => copyToClipboard(id)}
                  title="Click to copy"
                >
                  {id}
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No completed items.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
