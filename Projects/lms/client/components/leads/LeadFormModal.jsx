"use client";

import React, { useEffect, useState } from "react";

import styles from "./LeadFormModal.module.css";

import { Button, Modal, SelectInput, Textarea, TextInput } from "../ui";

import { FormComponent } from "../forms";
import { SelectRemote } from "../ui/jsx/SelectRemote";
import { LeadAPI } from "@/service";
import { TeamAPI } from "@/service/team.api";

export default function LeadFormModal({
  open,
  lead = null,
  stages = [],
  loading = false,
  error = "",
  onSubmit,
  onClose,
}) {
  const initialState = {
    lead_number: "",
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    product_interest: "",
    budget: "",
    source_id: null,
    priority_id: null,
    pipeline_id: null,
    stage: null,
    assigned_to: null,
    manager_id: null,
    team_id: null,
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

  useEffect(() => {
    if (!open || !lead?.id) {
      setForm(initialState);
      return;
    }

    const fetchLeadDetails = async () => {
      try {
        const { data } = await LeadAPI.getById(lead.id);

        setForm({
          lead_number: data.lead_number ?? "",
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          company: data.company ?? "",
          email: data.email ?? "",
          mobile: data.mobile ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "",
          postal_code: data.postal_code ?? "",
          product_interest: data.product_interest ?? "",
          budget: data.budget ?? "",

          // Enums
          source_id: data.source ?? null,
          priority_id: data.priority ?? null,
          pipeline_id: data.pipeline ?? null,
          stage: data.stage ?? null,

          // Relations
          assigned_to: data.assigned_to?.id ?? null,
          manager_id: data.manager?.id ?? null,
          team_id: data.team?.id ?? null,
        });
      } catch (error) {
        console.error("Failed to load lead details:", error);
      }
    };

    fetchLeadDetails();
  }, [open, lead?.id]);

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

      budget: form.budget ? Number(form.budget) : null,
      last_name: form.last_name || null,
      company: form.company || null,
      email: form.email || null,
      mobile: form.mobile || null,
    };

    onSubmit(payload);
  };

  if (!open) {
    return null;
  }

  return (
    <Modal title={lead ? "Edit Lead" : "Create Lead"} onClose={onClose}>
      <FormComponent
        title={null}
        description={null}
        actions={false}
        error={error}
      >
        <div className={styles.formGrid}>
          <TextInput
            label="Lead Number"
            placeholder="LEAD-001"
            required
            value={form.lead_number}
            onChange={(e) => updateField("lead_number", e.target.value)}
          />

          <TextInput
            label="First Name"
            placeholder="First name"
            required
            value={form.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
          />

          <TextInput
            label="Last Name"
            placeholder="Last name"
            value={form.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
          />

          <TextInput
            label="Company"
            value={form.company}
            onChange={(e) => updateField("company", e.target.value)}
          />

          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <TextInput
            label="Mobile"
            value={form.mobile}
            onChange={(e) => updateField("mobile", e.target.value)}
          />

          <SelectInput
            label="Stage"
            options={stages.filter((t) => t.label !== "All Stage")}
             value={form.stage}
            onChange={(e) => updateField("stage", e.target.value)}
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

          <TextInput
            label="Budget"
            type="number"
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
          />
        </div>

        <Textarea
          label="Address"
          rows={3}
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
        />

        <div className={styles.formGrid}>
          <TextInput
            label="City"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />

          <TextInput
            label="State"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
          />

          <TextInput
            label="Country"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
          />

          <TextInput
            label="Postal Code"
            value={form.postal_code}
            onChange={(e) => updateField("postal_code", e.target.value)}
          />
        </div>

        <Textarea
          label="Product Interest"
          rows={4}
          value={form.product_interest}
          onChange={(e) => updateField("product_interest", e.target.value)}
        />

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </FormComponent>
    </Modal>
  );
}
