"use client";

import React, { useState } from "react";
import { SelectInput } from "@/components/ui";
import { BASE_PATH } from "@/utils/basePath";
import { ResourceInputBuilder } from "./ResourceInputBuilder";
import styles from "../css/Project.module.css";

const RESOURCE_OPTIONS = [
  { value: BASE_PATH.labors, label: "Labors" },
  { value: BASE_PATH.rawMaterial, label: "Raw Materials" },
  { value: BASE_PATH.machines, label: "Machines" },
  { value: BASE_PATH.overheads, label: "Overheads" },
  { value: BASE_PATH.utilities, label: "Utilities" },
];

export function Projects() {
  const [resourceType, setResourceType] = useState("");

  return (
    <div className={styles.projectContainer}>
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
            resourceType={resourceType} // helper that converts e.g. "/labors" -> "labor"
            endpointForLookup={resourceType}
            onSubmit={(payload) => {
              // final add - you can append to a list of batch resources
              console.log("submit payload:", payload);
            }}
          />
        )}

        {/* tables to show all the added resouces categorise by type */}
      </div>
    </div>
  );
}
