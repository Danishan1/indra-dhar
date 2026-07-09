"use client";

import React, { useEffect, useState } from "react";

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
import { TaskAPI } from "@/service";

export default function TaskDetailsModal({
  open,
  task,
  users = [],
  onDelete,
  onClose,
}) {
  const [taskData, setTaskData] = useState(null);

  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const fetchTask = async () => {
    if (!task?.id) return;

    try {
      setLoading(true);

      const response = await TaskAPI.getById(task.id);

      const data = response.data;

      setTaskData(data.tasks);
      setComments(data.comments || []);
      setHistory(data.history || []);
    } catch (error) {
      console.error("Failed to fetch task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !task?.id) return;

    fetchTask();
  }, [open, task?.id]);

  const refreshAfterAction = async () => {
    await fetchTask();
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <Modal title="Task Details" onClose={onClose}>
        <div className={styles.container}>
          {loading || !taskData ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Header */}

              <div className={styles.header}>
                <div>
                  <h2>{taskData.title}</h2>

                  {taskData.description && (
                    <p className={styles.muted}>{taskData.description}</p>
                  )}
                </div>

                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      styles[taskData.priority?.toLowerCase()]
                    }`}
                  >
                    {taskData.priority}
                  </span>

                  <span
                    className={`${styles.badge} ${
                      styles[taskData.status?.toLowerCase()]
                    }`}
                  >
                    {taskData.status?.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Information */}

              <div className={styles.infoGrid}>
                <div>
                  <label>Assigned To</label>

                  <p>{taskData.assigned_to?.name || "-"}</p>
                </div>

                <div>
                  <label>Due Date</label>

                  <p>
                    {taskData.due_date
                      ? new Date(taskData.due_date).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <label>Lead</label>

                  <p>{taskData.lead?.name || "-"}</p>
                </div>

                <div>
                  <label>Outcome</label>

                  <p>{taskData.outcome || "No outcome"}</p>
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

                <Button variant="danger" onClick={() => onDelete(taskData.id)}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>

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

      <AssignTaskModal
        open={assignOpen}
        users={users}
        currentUser={taskData?.assigned_to}
        onSubmit={async (data) => {
          await TaskAPI.assign(taskData.id, data);

          setAssignOpen(false);

          refreshAfterAction();
        }}
        onClose={() => setAssignOpen(false)}
      />

      <ChangeStatusModal
        open={statusOpen}
        currentStatus={taskData?.status}
        onSubmit={async (data) => {
          await TaskAPI.changeStatus(taskData.id, data);

          setStatusOpen(false);

          refreshAfterAction();
        }}
        onClose={() => setStatusOpen(false)}
      />

      <OutcomeModal
        open={outcomeOpen}
        initialValue={taskData?.outcome}
        onSubmit={async (data) => {
          await TaskAPI.setOutcome(taskData.id, data);

          setOutcomeOpen(false);

          refreshAfterAction();
        }}
        onClose={() => setOutcomeOpen(false)}
      />

      <CommentModal
        open={commentOpen}
        taskId={taskData?.id}
        onSubmit={async (data) => {
          await TaskAPI.addComment(taskData.id, data);

          setCommentOpen(false);

          refreshAfterAction();
        }}
        onClose={() => setCommentOpen(false)}
      />
    </>
  );
}
