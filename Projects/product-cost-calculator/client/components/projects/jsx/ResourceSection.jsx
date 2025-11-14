"use client";

import { SelectInput } from "@/components/ui";
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

export function ResourceSection({ onAdd }) {
  const [resourceType, setResourceType] = useState("");

  return (
    <div className={styles.inputTake}>
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
