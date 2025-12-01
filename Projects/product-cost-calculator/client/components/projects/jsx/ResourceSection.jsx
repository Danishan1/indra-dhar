"use client";

import { SelectInput, TextInput } from "@/components/ui";
import styles from "../css/Project.module.css";
import { ResourceInputBuilder } from "./ResourceInputBuilder";
import { useState } from "react";

const RESOURCE_OPTIONS = [
  { value: "/labors", label: "Labors" },
  { value: "/raw-material", label: "Raw Materials" },
  { value: "/machines", label: "Machines" },
  { value: "/overheads", label: "Overheads" },
  { value: "/utilities", label: "Utilities" },
];

export function ResourceSection({ onAdd, setProjectMeta, projectMeta }) {
  const [resourceType, setResourceType] = useState("");

  return (
    <div className={styles.inputTake}>
      <div className={styles.metadata}>
        <div className={styles.metadata_input}>
          <TextInput
            label={"Product name"}
            value={projectMeta.project_name || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({ ...r, project_name: e.target.value }))
            }
            required
          />
        </div>
        <div className={styles.metadata_input}>
          <TextInput
            label={"Time (in months)"}
            type="number"
            value={projectMeta.project_duration_months || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({
                ...r,
                project_duration_months: e.target.value,
              }))
            }
            required
          />
        </div>
      </div>
      <div className={styles.metadata}>
        <div className={styles.metadata_input}>
          <TextInput
            label={"Product Profit Amount"}
            value={projectMeta.profit_value || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({ ...r, profit_value: e.target.value }))
            }
            required
          />
        </div>
        <div className={styles.metadata_input}>
          <SelectInput
            label={"Type"}
            value={projectMeta.profit_type || ""}
            options={[
              {
                value: "fixed",
                label: "Fixed",
              },
              { value: "percentage", label: "Percentage" },
            ]}
            onChange={(e) =>
              setProjectMeta((r) => ({
                ...r,
                profit_type: e.target.value,
              }))
            }
            required
          />
        </div>
      </div>

      <SelectInput
        label="Select Resource Type"
        options={RESOURCE_OPTIONS}
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
        required
      />

      {resourceType && (
        <ResourceInputBuilder
          resourceType={resourceType}
          endpointForLookup={resourceType}
          onSubmit={(data) => {
            onAdd?.(data);
            setResourceType("");
          }}
        />
      )}
    </div>
  );
}
