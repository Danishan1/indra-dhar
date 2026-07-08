"use client";

import React, { useState } from "react";

import styles from "./OutcomeModal.module.css";
import { Button, Modal, SelectInput } from "../ui";

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "PENDING",
  },

  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },

  {
    label: "Completed",
    value: "COMPLETED",
  },

  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

export default function ChangeStatusModal({
  open,
  currentStatus,
  loading = false,
  onSubmit,
  onClose,
}) {
  const [status, setStatus] = useState(currentStatus || "PENDING");

  if (!open) return null;

  return (
    <Modal title="Change Task Status" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectInput
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={() => onSubmit({ status })}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
