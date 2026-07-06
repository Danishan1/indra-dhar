"use client";

import React from "react";
import { IntegrationCard } from "./IntegrationCard";
import styles from "./IntegrationSection.module.css";

export function IntegrationSection({
  title,
  integrations,
  onConnect,
  onDisconnect,
  onEdit,
}) {
  return (
    <div className={styles.section}>
      <h2>{title}</h2>

      <div className={styles.grid}>
        {integrations.map((i) => (
          <IntegrationCard
            key={i.id}
            integration={i}
            onConnect={() => onConnect(i)}
            onDisconnect={() => onDisconnect(i)}
            onEdit={() => onEdit(i)}
          />
        ))}
      </div>
    </div>
  );
}
