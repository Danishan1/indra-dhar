"use client";

import React, { useEffect, useState } from "react";

import styles from "./LeadFormModal.module.css";

import { Button, Modal, SelectInput, Textarea, TextInput } from "../ui";

import { FormComponent } from "../forms";
import { SelectRemote } from "../ui/jsx/SelectRemote";

export default function LeadFormModal({
  open,
  lead = null,
  users = [],
  stages = [],
  sources = [],
  pipelines = [],
  priorities = [],
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
    stage_id: null,
    assigned_to: null,
    manager_id: null,
    team_id: null,
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (lead) {
      setForm({
        lead_number: lead.lead_number || "",
        first_name: lead.first_name || "",
        last_name: lead.last_name || "",
        company: lead.company || "",
        email: lead.email || "",
        mobile: lead.mobile || "",
        address: lead.address || "",
        city: lead.city || "",
        state: lead.state || "",
        country: lead.country || "",
        postal_code: lead.postal_code || "",
        product_interest: lead.product_interest || "",
        budget: lead.budget || "",
        source_id: lead.source_id || null,
        priority_id: lead.priority_id || null,
        pipeline_id: lead.pipeline_id || null,
        stage_id: lead.stage_id || null,
        assigned_to: lead.assigned_to || null,
        manager_id: lead.manager_id || null,
        team_id: lead.team_id || null,
      });
    } else {
      setForm(initialState);
    }
  }, [lead, open]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

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
            label="Pipeline"
            options={stages}
            value={form.stage_id}
            onChange={(e) => updateField("stage_id", e.target.value)}
          />

          <SelectRemote
            label="Assign To"
            endpoint={"/users"}
            labelField="full_name"
            valueField="id"
            required
            value={form.assigned_to}
            onChange={(e) => updateField("assigned_to", e.target.value)}
            placeholder="Select User"
          />

          <TextInput
            label="Budget"
            type="number"
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
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
