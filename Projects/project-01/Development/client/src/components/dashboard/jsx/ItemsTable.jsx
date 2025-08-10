import styles from "../css/ItemsTable.module.css";

export default function ItemsTable({ items }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Bulk Group ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td>{item.bulkGroupId || "-"}</td>
            <td>{item.name || "-"}</td>
            <td>
              <span className={`${styles.status} ${styles[item.status.toLowerCase()]}`}>
                {item.status}
              </span>
            </td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
