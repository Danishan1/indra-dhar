"use client";

import { useState } from "react";

import styles from "./Workflow.module.css";
import { Button, Modal, SelectInput, TextInput } from "../ui";
import { SelectRemote } from "../ui/jsx/SelectRemote";

export default function WorkflowConfigModal({
  workflow,
  onSave,
  onClose,
  onDelete,
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

          if (field.type === "selectRemote")
            return (
              <SelectRemote
                key={field.key}
                label={field.label}
                endpoint={field.endpoint}
                labelField={field.labelField}
                valueField={field.valueField}
                required
                value={config[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
                placeholder={field.label}
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

          <Button onClick={() => onSave(config, true)}>Save</Button>
          {workflow?.is_active && (
            <Button variant="outline" onClick={() => onSave(config, false)}>
              In Active
            </Button>
          )}

          <Button variant="danger" onClick={() => onDelete(workflow.key)}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
