"use client";

import WorkflowCard from "./WorkflowCard";
import styles from "./Workflow.module.css";

export default function WorkflowList({
  workflows = [],
  onConfigure,
  onRefresh,
}) {
  if (!workflows.length) {
    return <div className={styles.empty}>No workflows installed</div>;
  }

  return (
    <div className={styles.grid}>
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.key}
          workflow={workflow}
          onConfigure={onConfigure}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
