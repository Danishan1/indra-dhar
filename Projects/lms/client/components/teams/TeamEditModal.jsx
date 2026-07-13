"use client";

import React from "react";
import { TeamForm } from "./TeamForm";
import { Modal } from "../ui";

export function TeamEditModal({ team, open, onClose, onSuccess }) {
  if (!open) return null;

  return (
    <Modal title="Edit Team" onClose={onClose}>
      <TeamForm
        team={team}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    </Modal>
  );
}
