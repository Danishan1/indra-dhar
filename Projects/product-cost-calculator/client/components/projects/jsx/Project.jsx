"use client";

import React, { useState } from "react";
import { ResourceSection } from "./ResourceSection";
import { ResourceTables } from "./ResourceTables";
import styles from "../css/Project.module.css";
import { filterByType } from "../helper/resourceColumns";

export function Projects() {
  const [resources, setResources] = useState([]);

  // Add from input builder
  const handleAddResource = (item) => {
    setResources((prev) => [...prev, item]);
  };

  // Delete inside a grouped table
  const handleDelete = (type, rowIndex) => {
    setResources((prev) => {
      const filtered = filterByType(prev, type);
      const others = prev.filter((r) => r.resource_type !== type);

      const updated = filtered.filter((_, i) => i !== rowIndex);
      return [...others, ...updated];
    });
  };

  return (
    <div className={styles.projectContainer}>
      <ResourceSection onAdd={handleAddResource} />
      <ResourceTables resources={resources} onDelete={handleDelete} />
    </div>
  );
}
