"use client";

import React, { useState } from "react";

import styles from "./AssignTaskModal.module.css";
import { Button, Modal, SelectInput } from "../ui";
import { SelectRemote } from "../ui/jsx/SelectRemote";

export default function AssignTaskModal({
  open,
  users = [],
  currentUser,
  loading = false,
  onSubmit,
  onClose,
}) {
  const [assignedTo, setAssignedTo] = useState(currentUser || "");

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({
      assigned_to: assignedTo,
    });
  };

  return (
    <Modal title="Assign Task" onClose={onClose}>
      <div className={styles.wrapper}>
        <SelectRemote
          label="Assign To"
          endpoint={"/users"}
          labelField="full_name"
          valueField="id"
          required
          // options={users}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Select User"
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
