"use client";

import { Modal, Table } from "@/components/ui";
import styles from "../css/Project.module.css";
import {
  filterByType,
  RESOURCE_COLUMNS_MAP,
  RESOURCE_ORDER,
} from "../helper/resourceColumns";
import { BASE_PATH } from "@/utils/basePath";
import { useState } from "react";
import { BomDetails } from "./BomDetails";

export function ResourceTables({ resources, onDelete = null }) {
  const [bomItem, setBomItem] = useState(null);

  return (
    <div className={styles.resouceTables}>
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
              rowButtons={(row, index = null) => {
                const buttons = [];

                if (row.resource_type === BASE_PATH.bom) {
                  buttons.push({
                    label: "View",
                    onClick: () => {
                      setBomItem(row);
                    },
                  });
                }

                if (onDelete) {
                  buttons.push({
                    label: "Delete",
                    className: styles.btnDelete,
                    onClick: () => onDelete(type, index),
                  });
                }

                return buttons.length ? buttons : [];
              }}
            />
          </div>
        );
      })}

      {bomItem && (
        <Modal title={`BOM Details`} onClose={() => setBomItem(null)}>
          <BomDetails bomItem={bomItem} />
        </Modal>
      )}
    </div>
  );
}
