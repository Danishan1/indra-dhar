import ItemsTable from "./ItemsTable";
import styles from "../css/PhaseCard.module.css";

export default function PhaseCard({ phase }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.phaseName}>{phase.phaseName}</h2>
      {phase.items.length ? (
        <ItemsTable items={phase.items} />
      ) : (
        <p className={styles.noItems}>No items in this phase</p>
      )}
    </div>
  );
}
