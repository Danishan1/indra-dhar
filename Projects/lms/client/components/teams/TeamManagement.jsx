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

      setTeams(res.data || []);

      /*
        Keep selected team synced
        after refresh
      */
      if (selectedTeam) {
        const updated = res.data.find((t) => t.id === selectedTeam.id);

        if (updated) {
          setSelectedTeam(updated);
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
        <div>
          <h1>Team Management</h1>

          <p className={styles.subtitle}>
            Manage organizational teams, hierarchy and members.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>+ New Team</Button>
      </div>

      {/* Main Layout */}

      <div className={styles.layout}>
        {/* Team Tree */}

        <div className={styles.sidebar}>
          <div className={styles.cardHeader}>
            <h3>Teams</h3>
          </div>

          {loading ? (
            <p>Loading teams...</p>
          ) : (
            <TeamTree
              teams={teams}
              onSelect={(team) => {
                setSelectedTeam(team);
              }}
            />
          )}
        </div>

        {/* Details */}

        <div className={styles.content}>
          {selectedTeam ? (
            <TeamDetails team={selectedTeam} onDeleted={handleDeleted} />
          ) : (
            <div className={styles.empty}>
              <h3>Select a team</h3>

              <p>
                Choose a team from the left panel to manage members and
                settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}

      {createOpen && (
        <Modal title="Create Team" onClose={() => setCreateOpen(false)}>
          <TeamForm onSuccess={handleCreated} />
        </Modal>
      )}
    </div>
  );
}
