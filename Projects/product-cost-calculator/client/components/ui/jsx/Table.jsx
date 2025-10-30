import React, { useState } from "react";
import styles from "../css/Table.module.css";

export function Table({
  columns = [],
  data = [],
  rowClickable = false,
  onRowClick,
  rowButtons,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row, index) => {
    if (!rowClickable) return;

    // Select only one row at a time
    setSelectedRow(index);

    if (onRowClick) onRowClick(row, index);
  };

  const isSelected = (index) => selectedRow === index;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
            {rowButtons && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={index}
                className={`${styles.tableRow} ${
                  rowClickable ? styles.clickable : ""
                } ${isSelected(index) ? styles.selected : ""}`}
                onClick={() => handleRowClick(row, index)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row, index)
                      : row[col.key]}
                  </td>
                ))}

                {rowButtons && (
                  <td className={styles.actionsCell}>
                    {rowButtons(row, index).map((btn, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          btn.onClick(row, index);
                        }}
                        className={`${styles.actionButton} ${
                          btn.className || ""
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (rowButtons ? 1 : 0)}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
