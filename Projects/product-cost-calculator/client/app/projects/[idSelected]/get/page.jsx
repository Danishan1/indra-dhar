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
            <h2 className={styles.title}>{meta.project_name}</h2>
            <p>Total Cost: ₹{Number(meta.total_cost).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* 🔹 Tables */}
      <ResourceTables resources={resources} />
    </div>
  );
}
