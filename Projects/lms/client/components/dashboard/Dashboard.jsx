"use client";

import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

import { DashboardAPI } from "@/service/dashboard.api";
import { DashboardSummary } from "./DashboardSummary";
import { TeamPerformanceTree } from "./TeamPerformanceTree";

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await DashboardAPI.overview();

      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>

          <p>Organization performance overview</p>
        </div>
      </div>

      <DashboardSummary summary={data.summary} />

      <div className={styles.section}>
        <h2>Team Performance</h2>

        <TeamPerformanceTree teams={data.teams} />
      </div>
    </div>
  );
}
