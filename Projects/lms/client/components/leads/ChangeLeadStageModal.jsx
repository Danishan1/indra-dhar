"use client";

import React, { useEffect, useState } from "react";

import styles from "./ChangeLeadStageModal.module.css";

import { Button, Modal, SelectInput } from "../ui";

const STAGE_OPTIONS = [
  {
    label: "New",
    value: "NEW",
  },

  {
    label: "Contacted",
    value: "CONTACTED",
  },

  {
    label: "Qualified",
    value: "QUALIFIED",
  },

  {
    label: "Proposal",
    value: "PROPOSAL",
  },

  {
    label: "Negotiation",
    value: "NEGOTIATION",
  },

  {
    label: "Won",
    value: "WON",
  },

  {
    label: "Lost",
    value: "LOST",
  },
];

export default function ChangeLeadStageModal({
  open,
  currentStage = "NEW",
  loading = false,
  onSubmit,
  onClose,
}) {
  const [stage, setStage] = useState(currentStage);

  /**
   * Sync stage when opening
   */
  useEffect(() => {
    if (open) {
      setStage(currentStage || "NEW");
    }
  }, [open, currentStage]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit({
      stage,
    });
  };

  return (
    <Modal title="Change Lead Stage" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectInput
          label="Lead Stage"
          options={STAGE_OPTIONS}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update Stage"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
