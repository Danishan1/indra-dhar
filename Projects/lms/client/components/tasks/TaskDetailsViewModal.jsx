"use client";

import React from "react";


import {
  Calendar,
  User,
  Flag,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";

import styles from "./TaskDetailsViewModal.module.css";
import { Modal } from "../ui";

export default function TaskDetailsViewModal({
  open,

  task,

  comments = [],

  history = [],

  onClose,
}) {
  if (!open || !task) {
    return null;
  }

  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className={styles.container}>
        {/* Title */}

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{task.title}</h2>

            {task.description && (
              <p className={styles.description}>{task.description}</p>
            )}
          </div>

          <div className={styles.statusGroup}>
            <span
              className={`${styles.badge} ${styles[task.priority?.toLowerCase()]}`}
            >
              <Flag size={14} />

              {task.priority}
            </span>

            <span
              className={`${styles.badge} ${styles[task.status?.toLowerCase()]}`}
            >
              <CheckCircle size={14} />

              {task.status?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Task Information */}

        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <User size={18} />

            <div>
              <span>Assigned To</span>

              <strong>{task.assigned_name || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Calendar size={18} />

            <div>
              <span>Due Date</span>

              <strong>
                {task.due_date ? new Date(task.due_date).toLocaleString() : "-"}
              </strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <FileText size={18} />

            <div>
              <span>Task Type</span>

              <strong>{task.task_type_name || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Clock size={18} />

            <div>
              <span>Created At</span>

              <strong>
                {task.created_at
                  ? new Date(task.created_at).toLocaleString()
                  : "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* Outcome */}

        <section className={styles.section}>
          <h3>Outcome</h3>

          <div className={styles.outcome}>
            {task.outcome || "No outcome recorded"}
          </div>
        </section>

        {/* Comments */}

        <section className={styles.section}>
          <h3>Comments</h3>

          {comments.length === 0 ? (
            <p className={styles.empty}>No comments available</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <strong>{comment.user_name || "User"}</strong>

                  <small>{new Date(comment.created_at).toLocaleString()}</small>
                </div>

                <p>{comment.comment}</p>
              </div>
            ))
          )}
        </section>

        {/* History */}

        <section className={styles.section}>
          <h3>Activity History</h3>

          {history.length === 0 ? (
            <p className={styles.empty}>No history available</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <CheckCircle size={15} />

                <div>
                  <p>
                    {item.old_status && `${item.old_status} → `}

                    {item.new_status}
                  </p>

                  <small>{new Date(item.changed_at).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </Modal>
  );
}
