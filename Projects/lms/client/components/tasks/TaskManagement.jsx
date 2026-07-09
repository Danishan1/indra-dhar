"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./TaskManagement.module.css";
import { Plus, Search, Eye, Pencil, Trash2, CheckCircle } from "lucide-react";
import { Button, SelectInput, TextInput } from "../ui";
import TaskFormModal from "./TaskFormModal";
import TaskDetailsViewModal from "./TaskDetailsViewModal";
import TaskDetailsModal from "./TaskDetailsModal";
import { TaskAPI } from "@/service";
import { formatDateTime, timeAgo } from "@/utils/formatDateTime";

const STATUS_OPTIONS = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

const PRIORITY_OPTIONS = [
  {
    label: "All Priority",
    value: "",
  },
  {
    label: "Low",
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
  {
    label: "Urgent",
    value: "URGENT",
  },
];

export default function TaskManagement() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  /**
   * Modal States
   */

  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [actionTask, setActionTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState({
    comments: [],
    history: [],
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const response = await TaskAPI.list(filters);

      setTasks(response.data || response);
    } catch (err) {
      setError(err?.message || "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dummy dropdown data
   */

  const users = [
    {
      value: "u1",
      label: "John Doe",
    },

    {
      value: "u2",
      label: "Sarah",
    },
  ];

  const leads = [];

  const taskTypes = [];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || task.status === filters.status;

      const matchesPriority =
        !filters.priority || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, filters]);

  /**
   * Handlers
   */

  const createTask = async (data) => {
    try {
      setLoading(true);

      const task = await TaskAPI.create(data);

      setTasks((prev) => [...prev, task]);

      setCreateOpen(false);
    } catch (err) {
      setError(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (data) => {
    try {
      const updated = await TaskAPI.update(editTask.id, data);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editTask.id
            ? {
                ...task,
                ...updated,
              }
            : task,
        ),
      );

      setEditTask(null);
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await TaskAPI.remove(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));

      setActionTask(null);
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const changeStatus = async (id, data) => {
    const updated = await TaskAPI.changeStatus(id, data);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updated,
            }
          : task,
      ),
    );

    setActionTask(null);
  };

  const assignTask = async (id, data) => {
    const updated = await TaskAPI.assign(id, data);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updated,
            }
          : task,
      ),
    );
  };

  const updateOutcome = async (id, data) => {
    const updated = await TaskAPI.setOutcome(id, data);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updated,
            }
          : task,
      ),
    );
  };

  const addComment = async (id, data) => {
    const comment = await TaskAPI.addComment(id, data);

    setDetails((prev) => ({
      ...prev,

      comments: [...prev.comments, comment],
    }));
  };

  const openTaskDetails = async (task) => {
    setActionTask(task);

    const comments = await TaskAPI.comments(task.id);

    const history = await TaskAPI.history(task.id);

    setDetails({
      comments: comments.data || comments,

      history: history.data || history,
    });
  };

  if (loading) return <>Loading...</>;

  return (
    <div className={styles.wrapper}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h2>Task Management</h2>

          <p>Manage and track all LMS tasks.</p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={18} />
          New Task
        </Button>
      </div>

      {/* Filters */}

      <div className={styles.filters}>
        <TextInput
          placeholder="Search tasks..."
          value={filters.search}
          iconLeft={<Search size={16} />}
          onChange={(e) =>
            setFilters({
              ...filters,

              search: e.target.value,
            })
          }
        />

        <SelectInput
          label=""
          placeholder="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,

              status: e.target.value,
            })
          }
        />

        <SelectInput
          label=""
          placeholder="Priority"
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(e) =>
            setFilters({
              ...filters,

              priority: e.target.value,
            })
          }
        />
      </div>

      {/* Table */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Time</th>
              <th>Time Left</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.task}</td>

                  <td>{task.assigned}</td>

                  <td>
                    <span
                      className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`${styles.badge} ${styles[task.status.toLowerCase()]}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>{formatDateTime(task.due)}</td>
                  <td>{timeAgo(task.due)}</td>

                  <td>
                    <div className={styles.actions}>
                      <Button
                        variant="outline"
                        onClick={() => setViewTask(task)}
                      >
                        <Eye size={16} />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setEditTask(task)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => openTaskDetails(task)}
                      >
                        <CheckCircle size={16} />
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE */}

      <TaskFormModal
        open={createOpen}
        users={users}
        leads={leads}
        taskTypes={taskTypes}
        onSubmit={createTask}
        onClose={() => setCreateOpen(false)}
      />

      {/* EDIT */}

      <TaskFormModal
        open={!!editTask}
        task={editTask}
        users={users}
        leads={leads}
        taskTypes={taskTypes}
        onSubmit={updateTask}
        onClose={() => setEditTask(null)}
      />

      {/* VIEW ONLY */}

      <TaskDetailsViewModal
        open={!!viewTask}
        task={viewTask}
        comments={details.comments}
        history={details.history}
        onClose={() => setViewTask(null)}
      />

      {/* ACTION MODAL */}

      <TaskDetailsModal
        open={!!actionTask}
        task={actionTask}
        users={users}
        comments={[]}
        history={[]}
        onAssign={assignTask}
        onStatusChange={changeStatus}
        onOutcome={updateOutcome}
        onAddComment={addComment}
        onDelete={deleteTask}
        onClose={() => setActionTask(null)}
      />
    </div>
  );
}
