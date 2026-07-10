"use client";

import styles from "./Workflow.module.css";

export default function ExecutionTable({ executions = [] }) {
  if (!executions.length)
    return <div className={styles.empty}>No executions found</div>;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Workflow</th>

            <th>Status</th>

            <th>Started</th>

            <th>Completed</th>
          </tr>
        </thead>

        <tbody>
          {executions.map((item) => (
            <tr key={item.id}>
              <td>{item.workflow_key}</td>

              <td>{item.status}</td>

              <td>{item.started_at}</td>

              <td>{item.completed_at || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
