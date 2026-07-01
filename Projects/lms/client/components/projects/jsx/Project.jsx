"use client";

import React, { useState } from "react";
import { ResourceSection } from "./ResourceSection";
import { ResourceTables } from "./ResourceTables";
import styles from "../css/Project.module.css";
import { filterByType } from "../helper/resourceColumns";
import { Button } from "@/components/ui";
import { apiUtil } from "@/utils/api";
import { useToast } from "@/components/common";
import ImageInput from "@/components/ui/jsx/ImageInput";
import { DataDetails } from "./DataDetails";

export function Projects() {
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [projectMeta, setProjectMeta] = useState({});
  const { addToast } = useToast();

  // Add from input builder
  const handleAddResource = (item) => {
    setResources((prev) => [...prev, item]);
    setInvoice(null);
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

      // console.log("Calculation response:", res);

      if (res.success === true) setInvoice(res.data.invoice);
    } catch (error) {
      addToast("error", error?.response.data?.message || error.message || "Error in calculating project cost");
      console.error("Error calculating project cost:", error);
    }
  };

  const handleSave = async () => {
    try {
      // 1 Save project without image first
      const res = await apiUtil.post("/project-cost", {
        data: resources,
        meta: projectMeta,
      });

      const projectId = res?.data?.id;
      if (!projectId) {
        throw new Error("Project ID not returned from backend");
      }

      addToast("success", "Project saved! Any image will now be uploaded.");

      // 2 Upload image only if selected
      if (file) {
        const formData = new FormData();
        formData.append("project_id", projectId);
        formData.append("image", file);

        // console.log("Uploading: ", formData);

        await apiUtil.post("/project-cost/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        addToast("success", "Image uploaded successfully");
      }

      // 3 Reset UI State
      setProjectMeta({});
      setResources([]);
      setInvoice(null);
      setFile(null);
    } catch (error) {
      addToast(
        "error",
        error?.response?.data?.message ||
          "Error saving project or uploading image",
      );
      console.error(error);
    }
  };

  const handleImageChange = (f) => {
    setFile(f);
  };

  const handleClear = () => {
    setResources([]);
    setInvoice(null);
  };

  return (
    <div className={styles.projectContainer}>
      <ResourceSection
        onAdd={handleAddResource}
        setProjectMeta={setProjectMeta}
        projectMeta={projectMeta}
      />
      {resources.length > 0 && (
        <Button onClick={handleSubmit}>Calculate Product Cost</Button>
      )}
      {invoice && (
        <>
          <DataDetails data={invoice} />
          <ImageInput onChange={handleImageChange} maxSize={1024 * 1024 * 3} />
          <div className={styles.calculatedButtons}>
            <Button onClick={handleSave}>Save Product Cost</Button>
            <Button onClick={handleClear}>Clear</Button>
          </div>
        </>
      )}
      <ResourceTables resources={resources} onDelete={handleDelete} />
    </div>
  );
}
