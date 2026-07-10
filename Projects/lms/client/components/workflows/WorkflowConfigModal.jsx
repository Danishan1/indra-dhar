"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal/Modal";

import { TextInput } from "@/components/ui/TextInput/TextInput";

import { SelectInput } from "@/components/ui/SelectInput";

import { Button } from "@/components/ui/Button/Button";

import styles from "./Workflow.module.css";

export default function WorkflowConfigModal({
  workflow,

  onSave,

  onClose,
}) {
  const [config, setConfig] = useState(workflow.config || {});

  const update = (key, value) => {
    setConfig({
      ...config,

      [key]: value,
    });
  };

  return (
    <Modal title={`Configure ${workflow.name}`} onClose={onClose}>
      <div className={styles.form}>
        {workflow.settings?.map((field) => {
          if (field.type === "select")
            return (
              <SelectInput
                key={field.key}
                label={field.label}
                options={field.options.map((x) => ({
                  value: x,
                  label: x,
                }))}
                value={config[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
              />
            );

          return (
            <TextInput
              key={field.key}
              label={field.label}
              value={config[field.key] || ""}
              onChange={(e) => update(field.key, e.target.value)}
            />
          );
        })}

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => onSave(config)}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
