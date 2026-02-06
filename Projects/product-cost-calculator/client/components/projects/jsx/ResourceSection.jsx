"use client";

import { SelectInput, TextInput } from "@/components/ui";
import styles from "../css/Project.module.css";
import { ResourceInputBuilder } from "./ResourceInputBuilder";
import { useState } from "react";
import { BASE_PATH } from "@/utils/basePath";

const RESOURCE_OPTIONS = [
  { value: `${BASE_PATH.labors}`, label: "Labors" },
  { value: `${BASE_PATH.bom}`, label: "BOM" },
  // { value: `${BASE_PATH.machines}`, label: "Machines" },
  { value: `${BASE_PATH.overheads}`, label: "Overheads" },
  { value: `${BASE_PATH.indirectExpense}`, label: "Indirect Expenses" },
  // { value: `${BASE_PATH.utilities}`, label: "Utilities" },
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
      </div>
      <div className={styles.metadata}>
        <div className={styles.metadata_input}>
          <TextInput
            label={"Product Profit Amount"}
            type={"number"}
            value={projectMeta.profit_value || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({ ...r, profit_value: e.target.value }))
            }
            required
          />
        </div>

        <div className={styles.metadata_input}>
          <SelectInput
            label={"Profit Type"}
            value={projectMeta.profit_type || ""}
            options={[
              { value: "Fixed", label: "Fixed" },
              { value: "Percentage", label: "Percentage" },
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
        <div className={styles.metadata_input}>
          <TextInput
            label={"Product GST"}
            type={"number"}
            value={projectMeta.project_gst || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({ ...r, project_gst: e.target.value }))
            }
            required
          />
        </div>
      </div>
      <div className={styles.metadata}>
        <div className={styles.metadata_input}>
          <SelectInput
            label={"Project Type"}
            value={projectMeta.product_type || ""}
            options={[
              { value: "Finished", label: "Finished" },
              { value: "Semi Finished", label: "Semi Finished" },
              { value: "Raw Material", label: "Raw Material" },
            ]}
            onChange={(e) =>
              setProjectMeta((r) => ({
                ...r,
                product_type: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className={styles.metadata_input}>
          <SelectInput
            label={"Project Progress"}
            value={projectMeta.project_progress || ""}
            options={[
              { value: "Planned", label: "Planned" },
              { value: "Completed", label: "Completed" },
              { value: "In-Active", label: "In-Active" },
              { value: "Active", label: "Active" },
            ]}
            onChange={(e) =>
              setProjectMeta((r) => ({
                ...r,
                project_progress: e.target.value,
              }))
            }
            required
          />
        </div>
        <div className={styles.metadata_input}>
          <TextInput
            label={"Production quantity"}
            type={"number"}
            value={projectMeta.production_quantity || ""}
            onChange={(e) =>
              setProjectMeta((r) => ({
                ...r,
                production_quantity: e.target.value,
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
