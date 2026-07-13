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
import { TeamAPI } from "@/service/team.api";
import { SelectRemote } from "../ui/jsx/SelectRemote";

const PRIORITY_OPTIONS = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export default function TaskFormModal({
  open,
  task = null,

  leads = [],

  loading = false,
  error = "",

  onSubmit,
  onClose,
}) {
  const initialState = {
    title: "",
    description: "",
    team_id: null,
    assigned_to: null,
    lead_id: null,
    priority: "MEDIUM",
    due_date: "",
  };

  const [form, setForm] = useState(initialState);

  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  /**
   * Load teams
   */
  useEffect(() => {
    if (open) {
      loadTeams();
    }
  }, [open]);

  const loadTeams = async () => {
    try {
      const res = await TeamAPI.getAssignableTeam();

      setTeams(
        res.data.map((team) => ({
          label: team.name,
          value: team.id,
          members: team.members,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Populate edit data
   */
  useEffect(() => {
    if (task) {
      setForm({
        title: task.task || "",
        description: task.description || "",
        team_id: task.team_id || null,
        assigned_to: task.assigned_id || null,
        lead_id: task.lead_id || "",
        priority: task.priority || "MEDIUM",
        due_date: task.due ? task.due.substring(0, 10) : "",
      });
    } else {
      setForm(initialState);
      setTeamMembers([]);
    }
  }, [task, open]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Team changed
   */
  const handleTeamChange = (e) => {
    const teamId = e.target.value;

    const selectedTeam = teams.find((team) => team.value === teamId);

    setTeamMembers(selectedTeam?.members || []);

    setForm((prev) => ({
      ...prev,

      team_id: teamId,

      // reset user when team changes
      assigned_to: "",
    }));
  };

  const memberOptions = teamMembers.map((user) => ({
    label: user.full_name,
    value: user.id,
  }));

  const handleSubmit = () => {
    const payload = {
      ...form,

      lead_id: form.lead_id || null,
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

          <SelectInput
            label="Team"
            placeholder="Select Team"
            required
            options={teams}
            value={form.team_id}
            onChange={handleTeamChange}
          />

          <SelectInput
            label="Assign To"
            placeholder={form.team_id ? "Select Member" : "Select Team First"}
            disabled={!form.team_id}
            required
            options={memberOptions}
            value={form.assigned_to}
            onChange={(e) => updateField("assigned_to", e.target.value)}
          />

          <SelectRemote
            label="Lead"
            endpoint={"/leads"}
            labelField="name"
            valueField="id"
            required
            value={form.lead_id}
            onChange={(e) => updateField("lead_id", e.target.value)}
            placeholder="Select Lead"
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
