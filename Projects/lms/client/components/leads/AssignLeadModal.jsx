"use client";

import React, { useEffect, useState } from "react";

import styles from "./AssignLeadModal.module.css";

import { Button, Modal, SelectInput } from "../ui";
import { SelectRemote } from "../ui/jsx/SelectRemote";

export default function AssignLeadModal({
  open,
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
      to_user: assignedTo,
    });
  };

  return (
    <Modal title="Assign Lead" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectRemote
          label="Assign To"
          endpoint={"/users"}
          labelField="full_name"
          valueField="id"
          required
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Select User"
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
