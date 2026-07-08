"use client";

import React, { useEffect, useState } from "react";

import styles from "./AssignLeadModal.module.css";

import { Button, Modal, SelectInput } from "../ui";

export default function AssignLeadModal({
  open,

  users = [],

  currentUser = "",

  loading = false,

  onSubmit,

  onClose,
}) {
  const [assignedTo, setAssignedTo] = useState(currentUser || "");

  /**
   * Reset value when modal opens
   */
  useEffect(() => {
    if (open) {
      setAssignedTo(currentUser || "");
    }
  }, [open, currentUser]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    if (!assignedTo) {
      return;
    }

    onSubmit({
      assigned_to: assignedTo,
    });
  };

  return (
    <Modal title="Assign Lead" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectInput
          label="Assign To"
          placeholder="Select user"
          required
          options={users}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading || !assignedTo} onClick={handleSubmit}>
            {loading ? "Assigning..." : "Assign Lead"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
