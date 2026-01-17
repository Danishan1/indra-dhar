"use client";

import { ResourceTables } from "@/components/projects/jsx/ResourceTables";
import { apiUtil } from "@/utils/api";
import { BASE_PATH } from "@/utils/basePath";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./DetailPage.module.css";
import { baseUrl } from "@/utils/baseURL";
import { DataDetails } from "@/components/common";

export default function DetailPage() {
  const [resources, setResources] = useState([]);
  const [meta, setMeta] = useState({});
  const [invoice, setInvoice] = useState({});
  const { idSelected } = useParams();

  useEffect(() => {
    async function fetchData() {
      const res = await apiUtil.get(`${BASE_PATH.projectsCost}/${idSelected}`);

      const invoiceData = res.data.total_cost?.invoice || {};

      if (res.success) {
        setResources(res.data.items || []);
        setInvoice(invoiceData);
        setMeta({
          id: res.data.id,
          product_type: res.data.product_type,
          image_url: res.data.image_url,
          profit_value: res.data.profit_value,
          profit_type: res.data.profit_type,
          project_gst: res.data.project_gst,
          project_name: res.data.project_name,
          project_progress: res.data.project_progress,
          project_currency: invoiceData.currency,
          cost_before_profit: invoiceData.cost_before_profit,
          grand_total: invoiceData.grand_total,
          gst: invoiceData.gst,
          labor_total: invoiceData.labor_total,
          material_total: invoiceData.material_total,
          overhead_total: invoiceData.overhead_total,
          profit: invoiceData.profit,
          taxable_value: invoiceData.taxable_value,
        });
      }
    }
    fetchData();
  }, [idSelected]);

  const getImageURL = (value) => `${baseUrl}${value.slice(1)}`;

  const cost = meta || {};

  return (
    <div className={styles.wrapper}>
      {meta.image_url && (
        <div className={styles.imageWrapper}>
          <img
            src={getImageURL(meta.image_url)}
            alt="Project"
            className={styles.metaImage}
          />
        </div>
      )}
      {/* {meta.id && (
        <div className={styles.metaCard}>

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
      )} */}

      <DataDetails data={invoice} />

      <ResourceTables resources={resources} />
    </div>
  );
}
