"use client";

import React, { useState } from "react";

import {
  UserPlus,
  RefreshCcw,
  MessageSquare,
  FileText,
  CheckCircle,
  Trash2,
} from "lucide-react";

import AssignTaskModal from "./AssignTaskModal";
import ChangeStatusModal from "./ChangeStatusModal";
import OutcomeModal from "./OutcomeModal";
import CommentModal from "./CommentModal";

import styles from "./TaskDetailsModal.module.css";
import { Button, Modal } from "../ui";

export default function TaskDetailsModal({
  open,
  task,
  users = [],
  comments = [],
  history = [],
  loading = false,
  onAssign,
  onStatusChange,
  onOutcome,
  onAddComment,
  onDelete,
  onClose,
}) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  if (!open || !task) {
    return null;
  }

  return (
    <>
      <Modal title="Task Details" onClose={onClose}>
        <div className={styles.container}>
          {/* Header */}

          <div className={styles.header}>
            <div>
              <h2>{task.title}</h2>

              <p className={styles.muted}>{task.description}</p>
            </div>

            <div className={styles.badges}>
              <span
                className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}
              >
                {task.priority}
              </span>

              <span
                className={`${styles.badge} ${styles[task.status.toLowerCase()]}`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Information */}

          <div className={styles.infoGrid}>
            <div>
              <label>Assigned To</label>
              <p>{task.assigned_name || "-"}</p>
            </div>

            <div>
              <label>Due Date</label>
              <p>{task.due_date}</p>
            </div>

            <div>
              <label>Lead</label>
              <p>{task.lead_name || "-"}</p>
            </div>

            <div>
              <label>Outcome</label>
              <p>{task.outcome || "No outcome"}</p>
            </div>
          </div>

          {/* Actions */}

          <div className={styles.actions}>
            <Button variant="outline" onClick={() => setAssignOpen(true)}>
              <UserPlus size={16} />
              Assign
            </Button>

            <Button variant="outline" onClick={() => setStatusOpen(true)}>
              <RefreshCcw size={16} />
              Status
            </Button>

            <Button variant="outline" onClick={() => setOutcomeOpen(true)}>
              <FileText size={16} />
              Outcome
            </Button>

            <Button variant="outline" onClick={() => setCommentOpen(true)}>
              <MessageSquare size={16} />
              Comment
            </Button>

            <Button variant="danger" onClick={() => onDelete(task.id)}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>

          {/* Comments */}

          <section className={styles.section}>
            <h3>Comments</h3>

            {comments.length === 0 ? (
              <p className={styles.empty}>No comments yet</p>
            ) : (
              comments.map((item) => (
                <div key={item.id} className={styles.comment}>
                  <strong>{item.user_name}</strong>

                  <p>{item.comment}</p>

                  <small>{item.created_at}</small>
                </div>
              ))
            )}
          </section>

          {/* History */}

          <section className={styles.section}>
            <h3>History</h3>

            {history.map((item) => (
              <div key={item.id} className={styles.history}>
                <CheckCircle size={16} />

                <span>
                  {item.old_status && `${item.old_status} → `}

                  {item.new_status}
                </span>
              </div>
            ))}
          </section>
        </div>
      </Modal>

      <AssignTaskModal
        open={assignOpen}
        users={users}
        currentUser={task.assigned_to}
        onSubmit={(data) => {
          onAssign(task.id, data);

          setAssignOpen(false);
        }}
        onClose={() => setAssignOpen(false)}
      />

      <ChangeStatusModal
        open={statusOpen}
        currentStatus={task.status}
        onSubmit={(data) => {
          onStatusChange(task.id, data);

          setStatusOpen(false);
        }}
        onClose={() => setStatusOpen(false)}
      />

      <OutcomeModal
        open={outcomeOpen}
        initialValue={task.outcome}
        onSubmit={(data) => {
          onOutcome(task.id, data);

          setOutcomeOpen(false);
        }}
        onClose={() => setOutcomeOpen(false)}
      />

      <CommentModal
        open={commentOpen}
        taskId={task.id}
        onSubmit={(data) => {
          onAddComment(task.id, data);

          setCommentOpen(false);
        }}
        onClose={() => setCommentOpen(false)}
      />
    </>
  );
}
