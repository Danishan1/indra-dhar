"use client";

import { TeamAPI } from "@/service/team.api";
import React, { useState } from "react";
import { Button, Textarea, TextInput } from "../ui";
import { SelectRemote } from "../ui/jsx/SelectRemote";

export function TeamForm({ team = null, onSuccess }) {
  const [form, setForm] = useState({
    name: team?.name || "",
    description: team?.description || "",
    parent_team_id: team?.parent_team_id || null,
  });

  const [loading, setLoading] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (team) {
        await TeamAPI.update(team.id, form);
      } else {
        await TeamAPI.create(form);
      }

      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <TextInput
        label="Team Name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        required
      />

      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <SelectRemote
        label="Parent Team"
        endpoint="/teams"
        value={form.parent_team_id}
        onChange={(e) => update("parent_team_id", e.target.value)}
        placeholder="No parent team"
      />

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Team"}
        </Button>
      </div>
    </form>
  );
}
