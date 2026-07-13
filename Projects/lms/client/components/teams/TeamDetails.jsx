"use client";

import React, { useState, useEffect } from "react";

import styles from "./TeamDetails.module.css";
import { TeamAPI } from "@/service/team.api";
import { Button } from "../ui";
import { TeamMembers } from "./TeamMembers";
import { TeamEditModal } from "./TeamEditModal";
import { ConfirmModal } from "./ConfirmModal";

export function TeamDetails({ team, onDeleted }) {
  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const load = async () => {
    const res = await TeamAPI.getById(team.id);

    setData(res.data);
  };

  useEffect(() => {
    load();
  }, [team]);

  const deleteTeam = async () => {
    await TeamAPI.remove(team.id);

    setRemove(false);

    onDeleted?.();
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h2>{data.name}</h2>

          <p>{data.description}</p>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setEdit(true)}>
            Edit
          </Button>

          <Button variant="danger" onClick={() => setRemove(true)}>
            Delete
          </Button>
        </div>
      </div>

      <TeamMembers team={data} refresh={load} />

      <TeamEditModal
        team={data}
        open={edit}
        onClose={() => setEdit(false)}
        onSuccess={load}
      />

      <ConfirmModal
        open={remove}
        title="Delete Team"
        message={"Deleting this team will remove the team structure."}
        onClose={() => setRemove(false)}
        onConfirm={deleteTeam}
      />
    </div>
  );
}
