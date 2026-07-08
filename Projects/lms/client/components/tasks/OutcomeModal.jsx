"use client";

import React, { useState } from "react";

import styles from "./OutcomeModal.module.css";
import { Button, Modal, Textarea } from "../ui";

export default function OutcomeModal({
  open,
  initialValue = "",
  loading = false,
  onSubmit,
  onClose,
}) {
  const [outcome, setOutcome] = useState(initialValue);

  if (!open) return null;

  return (
    <Modal title="Task Outcome" onClose={onClose}>
      <div className={styles.wrapper}>
        <Textarea
          label="Outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Describe task outcome..."
          rows={5}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={() =>
              onSubmit({
                outcome,
              })
            }
          >
            {loading ? "Saving..." : "Save Outcome"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
