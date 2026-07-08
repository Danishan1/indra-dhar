"use client";

import React, { useEffect, useState } from "react";

import styles from "./CommentModal.module.css";
import { Button, Modal, Textarea } from "../ui";

export default function CommentModal({
  open,

  taskId,

  loading = false,

  initialComment = "",

  onSubmit,

  onClose,
}) {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setComment(initialComment || "");
    }
  }, [open, initialComment]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    if (!comment.trim()) {
      return;
    }

    onSubmit({
      task_id: taskId,

      comment: comment.trim(),
    });
  };

  return (
    <Modal title="Add Comment" onClose={onClose}>
      <div className={styles.wrapper}>
        <Textarea
          label="Comment"
          placeholder="Write your comment..."
          rows={5}
          value={comment}
          maxLength={5000}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading || !comment.trim()} onClick={handleSubmit}>
            {loading ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
