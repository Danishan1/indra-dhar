"use client";

import React, { useState } from "react";
import { ResourceSection } from "./ResourceSection";
import { ResourceTables } from "./ResourceTables";
import styles from "../css/Project.module.css";
import { filterByType } from "../helper/resourceColumns";
import { Button } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { DataDetails, useToast } from "@/components/common";

export function Projects() {
  const [resources, setResources] = useState([]);
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [projectMeta, setProjectMeta] = useState({});
  const { addToast } = useToast();

  // Add from input builder
  const handleAddResource = (item) => {
    setResources((prev) => [...prev, item]);
    setCalculatedResult(null);
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
        meta: projectMeta,
      });

      if (res.success === true) setCalculatedResult(res.data);
    } catch (error) {
      console.error("Error calculating project cost:", error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await apiUtil.post("/project-cost", {
        data: resources,
        meta: projectMeta,
      });

      addToast("success", "Project cost saved successfully");

      setProjectMeta({});
    } catch (error) {
      addToast(
        "error",
        error?.response?.data?.message || "Error saving project cost"
      );

      console.error("Error calculating project cost:", error);
    }
  };

  const handleClear = () => {
    setResources([]);
    setCalculatedResult(null);
  };

  return (
    <div className={styles.projectContainer}>
      <ResourceSection
        onAdd={handleAddResource}
        setProjectMeta={setProjectMeta}
        projectMeta={projectMeta}
      />
      {resources.length > 0 && (
        <Button onClick={handleSubmit}>Calculate Project Cost</Button>
      )}
      {calculatedResult && (
        <>
          <DataDetails data={calculatedResult} />
          <div className={styles.calculatedButtons}>
            <Button onClick={handleSave}>Save Project Cost</Button>
            <Button onClick={handleClear}>Clear</Button>
          </div>
        </>
      )}
      <ResourceTables resources={resources} onDelete={handleDelete} />
    </div>
  );
}
