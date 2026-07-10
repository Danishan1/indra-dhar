"use client";

import { Button } from "../ui";
import styles from "./Workflow.module.css";

export default function WorkflowCard({
  workflow,
  onConfigure,
  onRefresh,
}) {
  return (
    <div className={styles.workflowCard}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>{workflow.name}</h3>

          <p className={styles.description}>{workflow.description}</p>
        </div>

        <span
          className={`${styles.status} ${workflow.is_active ? styles.active : styles.inactive}`}
        >
          {workflow.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div>
        <p className={styles.event}>
          <strong>Event:</strong> {workflow.event}
        </p>
      </div>

      <div className={styles.actions}>
        <Button variant="primary" onClick={() => onConfigure(workflow)}>
          Configure
        </Button>

        <Button variant="secondary" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
