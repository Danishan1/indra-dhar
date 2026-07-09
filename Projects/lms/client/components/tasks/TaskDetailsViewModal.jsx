"use client";

import React, { useEffect, useState } from "react";

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
import { TaskAPI } from "@/service";

export default function TaskDetailsViewModal({ open, task, onClose }) {
  const [taskData, setTaskData] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !task?.id) return;

    const fetchTaskDetails = async () => {
      try {
        setLoading(true);

        const response = await TaskAPI.getById(task.id);

        const data = response.data;

        setTaskData(data.tasks || null);
        setComments(data.comments || []);
        setHistory(data.history || []);
      } catch (error) {
        console.error("Failed to load task details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [open, task?.id]);

  if (!open) {
    return null;
  }

  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className={styles.container}>
        {loading ? (
          <p>Loading...</p>
        ) : !taskData ? (
          <p className={styles.empty}>Task not found</p>
        ) : (
          <>
            {/* Header */}

            <div className={styles.header}>
              <div>
                <h2 className={styles.title}>{taskData.title}</h2>

                {taskData.description && (
                  <p className={styles.description}>{taskData.description}</p>
                )}
              </div>

              <div className={styles.statusGroup}>
                <span
                  className={`${styles.badge} ${
                    styles[taskData.priority?.toLowerCase()]
                  }`}
                >
                  <Flag size={14} />

                  {taskData.priority}
                </span>

                <span
                  className={`${styles.badge} ${
                    styles[taskData.status?.toLowerCase()]
                  }`}
                >
                  <CheckCircle size={14} />

                  {taskData.status?.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Task Information */}

            <div className={styles.infoCard}>
              <div className={styles.infoItem}>
                <User size={18} />

                <div>
                  <span>Assigned To</span>

                  <strong>{taskData.assigned_to?.name || "-"}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Calendar size={18} />

                <div>
                  <span>Due Date</span>

                  <strong>
                    {taskData.due_date
                      ? new Date(taskData.due_date).toLocaleString()
                      : "-"}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FileText size={18} />

                <div>
                  <span>Task Type</span>

                  <strong>{taskData.task_type?.name || "-"}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <Clock size={18} />

                <div>
                  <span>Created At</span>

                  <strong>
                    {taskData.created_at
                      ? new Date(taskData.created_at).toLocaleString()
                      : "-"}
                  </strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <User size={18} />

                <div>
                  <span>Lead</span>

                  <strong>{taskData.lead?.name || "-"}</strong>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FileText size={18} />

                <div>
                  <span>Lead Number</span>

                  <strong>{taskData.lead?.lead_number || "-"}</strong>
                </div>
              </div>
            </div>

            {/* Outcome */}

            <section className={styles.section}>
              <h3>Outcome</h3>

              <div className={styles.outcome}>
                {taskData.outcome || "No outcome recorded"}
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

                      <small>
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
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
                history.map((item) => {
                  let message = "";

                  if (item.old_status || item.new_status) {
                    message = `Status changed from ${item.old_status} to ${item.new_status}`;
                  } else if (item.old_assigned_to || item.new_assigned_to) {
                    if (!item.old_assigned_to) {
                      message = `Assigned to ${item.new_assigned_to}`;
                    } else {
                      message = `Reassigned from ${item.old_assigned_to} to ${item.new_assigned_to}`;
                    }
                  } else {
                    message = "Task updated";
                  }

                  return (
                    <div key={item.id} className={styles.historyItem}>
                      <CheckCircle size={15} />

                      <div className={styles.historyContent}>
                        <p>{message}</p>

                        {item.changed_by && (
                          <small className={styles.historyUser}>
                            By <strong>{item.changed_by.name}</strong>
                          </small>
                        )}

                        <small className={styles.historyDate}>
                          {item.changed_at
                            ? new Date(item.changed_at).toLocaleString()
                            : "-"}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </>
        )}
      </div>
    </Modal>
  );
}
