"use client";

import React from "react";
import styles from "./IntegrationCard.module.css";
import { Button } from "../ui";

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onEdit,
}) {
  return (
    <div className={styles.card}>
      <div>
        <h3>{integration.name}</h3>

        <p className={styles.meta}>{integration.type}</p>

        <span
          className={
            integration.status === "CONNECTED"
              ? styles.connected
              : integration.status === "ERROR"
                ? styles.error
                : styles.disconnected
          }
        >
          {integration.status}
        </span>
      </div>

      <div className={styles.actions}>
        {integration.status === "CONNECTED" ? (
          <>
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="danger" onClick={onDisconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onConnect}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}
