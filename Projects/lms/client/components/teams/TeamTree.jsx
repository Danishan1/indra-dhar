"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Users, FolderTree } from "lucide-react";

import styles from "./TeamTree.module.css";

export function TeamTree({ teams = [], onSelect }) {
  const [expanded, setExpanded] = useState({});
  const [selected, setSelected] = useState(null);

  const tree = useMemo(() => {
    const map = {};

    teams.forEach((team) => {
      map[team.id] = {
        ...team,
        children: [],
      };
    });

    const roots = [];

    teams.forEach((team) => {
      if (team.parent_team_id) {
        map[team.parent_team_id]?.children.push(map[team.id]);
      } else {
        roots.push(map[team.id]);
      }
    });

    return roots;
  }, [teams]);

  const toggle = (id) => {
    setExpanded((prev) => ({
      ...prev,

      [id]: !prev[id],
    }));
  };

  const selectTeam = (team) => {
    setSelected(team.id);

    onSelect?.(team);
  };

  const render = (items, level = 0) => {
    return items.map((team) => (
      <div key={team.id} className={styles.branch}>
        <div
          className={`${styles.node}
          ${selected === team.id ? styles.selected : ""}`}
          style={{
            "--level": level,
          }}
        >
          <div className={styles.left}>
            {team.children.length > 0 ? (
              <button className={styles.expand} onClick={() => toggle(team.id)}>
                {expanded[team.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              <span className={styles.spacer} />
            )}

            <FolderTree size={17} className={styles.icon} />

            <button className={styles.team} onClick={() => selectTeam(team)}>
              {team.name}
            </button>
          </div>

          <div className={styles.meta}>
            <span>
              <Users size={13} />

              {team.members_count || 0}
            </span>
          </div>
        </div>

        {expanded[team.id] && team.children.length > 0 && (
          <div className={styles.children}>
            {render(team.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return <div className={styles.tree}>{render(tree)}</div>;
}
