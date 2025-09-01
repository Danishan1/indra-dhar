import { useNavigate } from "react-router-dom";
import Button from "../../common/jsx/Button";
import styles from "../css/PhaseCard.module.css";

export default function PhaseCard({ phase }) {
  const { phaseName, items, orders } = phase;
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <h2 className={styles.phaseName}>{phaseName}</h2>

      {/* Item Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <strong>Total Quantity Recieved:</strong> {items.total}
        </div>
        <div className={styles.summaryItem}>
          <strong>Balance Quantity in Stock:</strong> {items.pending}
        </div>
        <div className={styles.summaryItem}>
          <strong>Sent Quantity Forward:</strong> {items.completed}
        </div>
      </div>

      {/* Order Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <strong>Total Orders Recieved:</strong> {orders.totalOrders}
        </div>
        <div className={styles.summaryItem}>
          <strong>Balance Orders in Stock:</strong> {orders.pendingOrders}
        </div>
        <div className={styles.summaryItem}>
          <strong>Sent Orders Forwards:</strong> {orders.completedOrders}
        </div>
      </div>

      <Button
        onClick={() => navigate(`/user/view-item-list/${phaseName}`)}
        style={{ width: "150px" }}
      >
        View
      </Button>

      {/* <div className={styles.buttons}>
        <Button
          onClick={() => navigate(`/user/move-backward/${phaseName}`)}
          style={{ width: "150px" }}
        >
          Send Back
        </Button>
        <Button
          onClick={() => navigate(`/user/move-forward/${phaseName}`)}
          style={{ width: "150px" }}
        >
          Move Forward
        </Button>
      </div> */}
    </div>
  );
}
