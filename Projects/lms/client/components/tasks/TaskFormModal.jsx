"use client";

import React, { useEffect, useState } from "react";

import styles from "./TaskFormModal.module.css";
import {
  Button,
  DateInput,
  Modal,
  SelectInput,
  Textarea,
  TextInput,
} from "../ui";
import { FormComponent } from "../forms";
import { SelectRemote } from "../ui/jsx/SelectRemote";

const PRIORITY_OPTIONS = [
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

export default function TaskFormModal({
  open,

  task = null,

  leads = [],
  taskTypes = [],

  loading = false,

  error = "",

  onSubmit,
  onClose,
}) {
  const initialState = {
    title: "",
    description: "",
    assigned_to: "",
    lead_id: "",
    task_type_id: "",
    priority: "MEDIUM",
    due_date: "",
  };

  const [form, setForm] = useState(initialState);

  /**
   * Populate form when editing
   */
  useEffect(() => {
    if (task) {
      setForm({
        title: task.task || "",
        description: task.description || "",
        assigned_to: task.assigned_id || "",
        lead_id: task.lead_id || "",
        task_type_id: task.task_type_id || "",
        priority: task.priority || "MEDIUM",
        due_date: task.due ? task.due.substring(0, 10) : "",
      });
    } else {
      setForm(initialState);
    }
  }, [task, open]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,

      // convert empty optional fields
      lead_id: form.lead_id || null,
      task_type_id: form.task_type_id || null,
    };

    onSubmit(payload);
  };

  if (!open) {
    return null;
  }

  return (
    <Modal title={task ? "Edit Task" : "Create Task"} onClose={onClose}>
      <FormComponent
        title={null}
        description={null}
        actions={false}
        error={error}
      >
        <div className={styles.formGrid}>
          <TextInput
            label="Task Title"
            placeholder="Enter task title"
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />

          <SelectRemote
            label="Assign To"
            endpoint={"/users"}
            labelField="full_name"
            valueField="id"
            required
            // options={users}
            value={form.assigned_to}
            onChange={(e) => updateField("assigned_to", e.target.value)}
            placeholder="Select User"
          />

          <SelectInput
            label="Lead"
            placeholder="Select lead"
            options={leads}
            value={form.lead_id}
            onChange={(e) => updateField("lead_id", e.target.value)}
          />

          <SelectInput
            label="Task Type"
            placeholder="Select task type"
            options={taskTypes}
            value={form.task_type_id}
            onChange={(e) => updateField("task_type_id", e.target.value)}
          />

          <SelectInput
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value)}
          />

          <DateInput
            label="Due Date"
            required
            value={form.due_date}
            onChange={(e) => updateField("due_date", e.target.value)}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Add task details..."
          rows={5}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </FormComponent>
    </Modal>
  );
}
