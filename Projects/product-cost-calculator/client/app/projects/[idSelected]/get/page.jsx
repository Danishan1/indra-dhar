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
        setMeta(res.data);
      }
    }
    fetchData();
  }, [idSelected]);

  const getImageURL = (value) => `${baseUrl}${value.slice(1)}`;

  const cost = meta.total_cost || {};

  return (
    <div className={styles.wrapper}>
      {meta.id && (
        <div className={styles.metaCard}>
          {/* Image */}
          {meta.image_url && (
            <div className={styles.imageWrapper}>
              <img
                src={getImageURL(meta.image_url)}
                alt="Project"
                className={styles.metaImage}
              />
            </div>
          )}

          {/* Project Info */}
          <div className={styles.card}>
            <h2 className={styles.title}>{meta.project_name}</h2>
            <div className={styles.costGrid}>
              <p>
                <b>Project ID</b>
                <span>{meta.id}</span>
              </p>
              <p>
                <b>Product Type</b>
                <span>{meta.product_type}</span>
              </p>
              <p>
                <b>Status</b>
                <span>{meta.project_progress}</span>
              </p>
              <p>
                <b>Profit Type</b>
                <span>{meta.profit_type}</span>
              </p>
              <p>
                <b>Profit Value</b>
                <span>{meta.profit_value}</span>
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Cost Breakdown</h3>
            <div className={styles.costGrid}>
              <p>
                <b>Material Base</b>
                <span>{cost.materialBaseTotal}</span>
              </p>
              <p>
                <b>GST (ITC)</b>
                <span>{cost.materialGstItc}</span>
              </p>
              <p>
                <b>GST (Non-ITC)</b>
                <span>{cost.materialGstNonItc}</span>
              </p>
              <p>
                <b>Raw Material</b>
                <span>{cost.rawMaterialTotal}</span>
              </p>
              <p>
                <b>Labor</b>
                <span>{cost.laborTotal}</span>
              </p>
              <p>
                <b>Overhead</b>
                <span>{cost.overheadTotal}</span>
              </p>
              <p>
                <b>Direct Cost</b>
                <span>{cost.directCost}</span>
              </p>
            </div>
          </div>

          {/* Final Summary */}
          <div className={`${styles.card} ${styles.costGrid}`}>
            <p>
              <b>Cost Before Profit</b> <span>{cost.costBeforeProfit}</span>
            </p>
            <p>
              <b>Profit</b> <span>{cost.profit}</span>
            </p>
            <p>
              <b>Taxable Value</b> <span>{cost.taxableValue}</span>
            </p>
            <p>
              <b>Output GST</b> <span>{cost.outputGst}</span>
            </p>
            <p className={styles.finalCost}>
              <b>Final Cost</b>
              <span>{cost.finalCost}</span>
            </p>
          </div>
        </div>
      )}

      <ResourceTables resources={resources} />
    </div>
  );
}
