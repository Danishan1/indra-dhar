"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal/Modal";

import { SelectInput } from "@/components/ui/SelectInput";

import { Button } from "@/components/ui/Button/Button";

import styles from "./Workflow.module.css";

export default function WorkflowInstallModal({
  workflows = [],

  onInstall,

  onClose,
}) {
  const [selected, setSelected] = useState("");

  return (
    <Modal title="Install Workflow" onClose={onClose}>
      <div className={styles.form}>
        <SelectInput
          label="Workflow"
          options={workflows.map((item) => ({
            value: item.key,
            label: item.name,
          }))}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        />

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={!selected} onClick={() => onInstall(selected)}>
            Install
          </Button>
        </div>
      </div>
    </Modal>
  );
}
