"use client";

import React, { useState } from "react";

import {
  ChevronRight,
  ChevronDown,
  Users,
  Target,
  CheckCircle,
} from "lucide-react";

import styles from "./TeamTree.module.css";

export function TeamPerformanceTree({ teams = [] }) {
  const [open, setOpen] = useState({});

  const toggle = (id) => {
    setOpen((prev) => ({
      ...prev,

      [id]: !prev[id],
    }));
  };

  const render = (items) => {
    return items.map((team) => (
      <div key={team.id} className={styles.branch}>
        <div className={styles.row}>
          <div className={styles.left}>
            {team.children.length > 0 && (
              <button className={styles.expand} onClick={() => toggle(team.id)}>
                {open[team.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            )}

            <div className={styles.name}>{team.name}</div>
          </div>

          <div className={styles.metrics}>
            <span>
              <Users size={14} />
              {team.members}
            </span>

            <span>
              <Target size={14} />
              {team.leads}
            </span>

            <span>
              <CheckCircle size={14} />
              {team.converted}
            </span>
          </div>
        </div>

        {open[team.id] && team.children.length > 0 && (
          <div className={styles.children}>{render(team.children)}</div>
        )}
      </div>
    ));
  };

  return <div className={styles.tree}>{render(teams)}</div>;
}
