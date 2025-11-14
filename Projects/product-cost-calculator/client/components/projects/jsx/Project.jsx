"use client";

import React, { useState } from "react";
import { ResourceSection } from "./ResourceSection";
import { ResourceTables } from "./ResourceTables";
import styles from "../css/Project.module.css";
import { filterByType } from "../helper/resourceColumns";
import { Button } from "@/components/ui";
import { apiUtil } from "@/utils/api";

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

  const handleSubmit = async () => {
    try {
      const res = await apiUtil.post("/calculate-project-cost", {
        data: resources,
      });

      console.log("Project cost calculated:", res.data);
    } catch (error) {
      console.error("Error calculating project cost:", error);
    }
  };

  return (
    <div className={styles.projectContainer}>
      <ResourceSection onAdd={handleAddResource} />
      {resources.length > 0 && (
        <Button onClick={handleSubmit}>Calculate Project Cost</Button>
      )}
      <ResourceTables resources={resources} onDelete={handleDelete} />
    </div>
  );
}
