"use client";

import { Table } from "@/components/ui";
import styles from "../css/Project.module.css";
import {
  filterByType,
  RESOURCE_COLUMNS_MAP,
  RESOURCE_ORDER,
} from "../helper/resourceColumns";

export function ResourceTables({ resources, onDelete }) {
  return (
    <div>
      {RESOURCE_ORDER.map((type) => {
        const grouped = filterByType(resources, type);
        if (grouped.length === 0) return null;

        return (
          <div key={type} className={styles.tableGroupSection}>
            <h3 className={styles.sectionTitle}>
              {type.slice(1).replace("-", " ").toUpperCase()}
            </h3>

            <Table
              columns={RESOURCE_COLUMNS_MAP[type]}
              data={grouped}
              rowButtons={(row, index) => [
                {
                  label: "Delete",
                  className: "btn-delete",
                  onClick: () => onDelete(type, index),
                },
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}
