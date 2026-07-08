"use client";

import React, { useEffect, useState } from "react";

import styles from "./NoteModal.module.css";

import { Button, Modal, Textarea } from "../ui";

export default function NoteModal({
  open,

  leadId,

  initialNote = "",

  loading = false,

  onSubmit,

  onClose,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setNote(initialNote || "");
    }
  }, [open, initialNote]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    const value = note.trim();

    if (!value) {
      return;
    }

    onSubmit({
      lead_id: leadId,

      note: value,
    });
  };

  return (
    <Modal title="Add Lead Note" onClose={onClose}>
      <div className={styles.wrapper}>
        <Textarea
          label="Note"
          placeholder="Write your note..."
          rows={6}
          value={note}
          maxLength={5000}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading || !note.trim()} onClick={handleSubmit}>
            {loading ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
