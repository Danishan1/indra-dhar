"use client";

import React, { useEffect, useState } from "react";

import styles from "./ChangeLeadStatusModal.module.css";

import { Button, Modal, SelectInput } from "../ui";

const STATUS_OPTIONS = [
  {
    label: "Active",
    value: "ACTIVE",
  },

  {
    label: "Inactive",
    value: "INACTIVE",
  },

  {
    label: "Converted",
    value: "CONVERTED",
  },

  {
    label: "Closed",
    value: "CLOSED",
  },

  {
    label: "Junk",
    value: "JUNK",
  },
];

export default function ChangeLeadStatusModal({
  open,

  currentStatus = "ACTIVE",

  loading = false,

  onSubmit,

  onClose,
}) {
  const [status, setStatus] = useState(currentStatus);

  /**
   * Reset status when modal opens
   */
  useEffect(() => {
    if (open) {
      setStatus(currentStatus || "ACTIVE");
    }
  }, [open, currentStatus]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit({
      status,
    });
  };

  return (
    <Modal title="Change Lead Status" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectInput
          label="Lead Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
