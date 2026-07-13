"use client";

import React, { useEffect, useState } from "react";

import styles from "./TeamManagement.module.css";

import { Button, Modal } from "../ui";
import { TeamTree } from "./TeamTree";
import { TeamDetails } from "./TeamDetails";
import { TeamForm } from "./TeamForm";

import { TeamAPI } from "@/service/team.api";

export default function TeamManagement() {
  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadTeams = async () => {
    try {
      setLoading(true);

      const res = await TeamAPI.list();

      const data = res.data || [];

      setTeams(data);

      if (selectedTeam) {
        const updated = data.find((team) => team.id === selectedTeam.id);

        if (updated) {
          setSelectedTeam(updated);
        } else {
          setSelectedTeam(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreated = () => {
    setCreateOpen(false);

    loadTeams();
  };

  const handleDeleted = () => {
    setSelectedTeam(null);

    loadTeams();
  };

  return (
    <div className={styles.container}>
      {/* Header */}

      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Team Management</h1>

          <p className={styles.subtitle}>
            Manage organizational teams, hierarchy and members.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>+ New Team</Button>
      </div>

      {/* Main */}

      <div className={styles.layout}>
        {/* Team Tree */}

        <aside className={styles.sidebar}>
          <div className={styles.cardHeader}>
            <h3>Teams</h3>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading teams...</div>
          ) : (
            <TeamTree
              teams={teams}
              onSelect={(team) => {
                setSelectedTeam(team);
              }}
            />
          )}
        </aside>

        {/* Details */}

        <section className={styles.content}>
          {selectedTeam ? (
            <>
              <div className={styles.mobileBack}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTeam(null)}
                >
                  ← Back to Teams
                </Button>
              </div>

              <TeamDetails team={selectedTeam} onDeleted={handleDeleted} />
            </>
          ) : (
            <div className={styles.empty}>
              <h3>Select a team</h3>

              <p>Choose a team from the list to manage members and settings.</p>
            </div>
          )}
        </section>
      </div>

      {/* Create Team */}

      {createOpen && (
        <Modal title="Create Team" onClose={() => setCreateOpen(false)}>
          <TeamForm onSuccess={handleCreated} />
        </Modal>
      )}
    </div>
  );
}
