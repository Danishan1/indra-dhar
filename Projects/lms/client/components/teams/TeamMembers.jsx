"use client";

import React, { useEffect, useState } from "react";

import styles from "./TeamMembers.module.css";
import { SelectRemote } from "../ui/jsx/SelectRemote";
import { Button } from "../ui";
import { TeamAPI } from "@/service/team.api";
import { ConfirmModal } from "./ConfirmModal";

export function TeamMembers({ team, refresh }) {
  const [members, setMembers] = useState([]);
  const [remove, setRemove] = useState(false);

  const [user, setUser] = useState("");

  const loadMembers = async () => {
    const res = await TeamAPI.members(team.id);

    setMembers(res.data);
  };

  useEffect(() => {
    loadMembers();
  }, [team]);

  const add = async () => {
    if (!user) return;

    await TeamAPI.addMember(team.id, {
      user_id: user,
      is_leader: false,
    });

    setUser("");

    loadMembers();

    refresh?.();
  };

  const handleRemove = async (userId) => {
    await TeamAPI.removeMember(team.id, userId);

    loadMembers();

    refresh?.();
  };

  const toggleLeader = async (member) => {
    await TeamAPI.setLeader(team.id, {
      user_id: member.id,
      is_leader: !member.is_leader,
    });

    loadMembers();
  };

  return (
    <div className={styles.wrapper}>
      <h3>Members</h3>

      <div className={styles.add}>
        <SelectRemote
          label="Add Member"
          endpoint={"/users"}
          labelField="full_name"
          valueField="id"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Select User"
        />

        <Button onClick={add}>Add</Button>
      </div>

      <div className={styles.list}>
        {members.map((member) => (
          <div key={member.id} className={styles.member}>
            <div>
              <strong>{member.full_name}</strong>

              <p>{member.email}</p>
            </div>

            <div className={styles.actions}>
              <Button
                size="sm"
                variant={member.is_leader ? "secondary" : "outline"}
                onClick={() => toggleLeader(member)}
              >
                {member.is_leader ? "Leader" : "Make Leader"}
              </Button>

              <Button
                size="sm"
                variant="danger"
                onClick={() => setRemove(true)}
              >
                Remove
              </Button>

              <ConfirmModal
                open={remove}
                title="Delete Team"
                message={"Deleting this team member will remove the member from team structure."}
                onClose={() => setRemove(false)}
                onConfirm={() => handleRemove(member.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
