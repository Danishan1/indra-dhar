"use client";

import { ResourceTables } from "@/components/projects/jsx/ResourceTables";
import { apiUtil } from "@/utils/api";
import { BASE_PATH } from "@/utils/basePath";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DetailPage.module.css";
import { baseUrl } from "@/utils/baseURL";

export default function DetailPage() {
  const [resources, setResources] = useState([]);
  const [meta, setMeta] = useState({});
  const { idSelected } = useParams();

  useEffect(() => {
    async function fetchData() {
      const res = await apiUtil.get(`${BASE_PATH.projectsCost}/${idSelected}`);

      if (res.success) {
        setResources(res.data.items || []);
        setMeta({
          id: res.data.id,
          image_url: res.data.image_url,
          project_name: res.data.project_name,
          total_cost: res.data.total_cost,
          product_type: res.data.product_type,
          profit_type: res.data.profit_type,
          profit_value: res.data.profit_value,
          project_gst: res.data.project_gst,
          project_progress: res.data.project_progress,
        });
      }
    }
    fetchData();
  }, [idSelected]);

  const getImageURL = (value) => {
    const t = `${baseUrl}${value.slice(1)}`;
    return t;
  };

  return (
    <div className={styles.wrapper}>
      {/* 🔹 Project Meta */}
      {meta.id && (
        <div className={styles.metaCard}>
          {meta.image_url && (
            <img
              src={getImageURL(meta.image_url)}
              alt="Project"
              className={styles.metaImage}
            />
          )}

          <div className={styles.metaInfo}>
            <p>Project Id: {meta.id}</p>
            <h2 className={styles.title}>{meta.project_name}</h2>
            <p>Profit Type: {meta.profit_type}</p>
            <p>Profit value: {meta.profit_value}</p>
            <p>Profit Amount: {meta.total_cost.profit}</p>
          </div>
          <div className={styles.metaInfo}>
            <p>Final Cost: {meta.total_cost.finalCost}</p>
            <p>Total Before Profit: {meta.total_cost.totalBeforeProfit}</p>
            <p>Project GST: {meta.total_cost.projectGST}</p>
            <p>Labor Total: {meta.total_cost.laborTotal}</p>
            <p>Machine Total: {meta.total_cost.machineTotal}</p>
            <p>Overhead Total: {meta.total_cost.overheadTotal}</p>
            <p>Raw Material Total: {meta.total_cost.rawMaterialTotal}</p>
            <p>Utility Total: {meta.total_cost.utilityTotal}</p>
          </div>
        </div>
      )}

      {/* 🔹 Tables */}
      <ResourceTables resources={resources} />
    </div>
  );
}
