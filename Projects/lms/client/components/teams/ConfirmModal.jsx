"use client";

import React from "react";
import { Button, Modal } from "../ui";

export function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
