"use client";

import React from "react";

import styles from "./Summary.module.css";

export function DashboardSummary({ summary }) {
  const cards = [
    {
      title: "Users",
      value: summary.total_users,
    },

    {
      title: "Active Users",
      value: summary.active_users,
    },

    {
      title: "Teams",
      value: summary.total_teams,
    },

    {
      title: "Total Leads",
      value: summary.total_leads,
    },

    {
      title: "Open Leads",
      value: summary.open_leads,
    },

    {
      title: "Converted",
      value: summary.closed_leads,
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <div key={card.title} className={styles.card}>
          <h4>{card.title}</h4>

          <strong>{card.value}</strong>
        </div>
      ))}
    </div>
  );
}
