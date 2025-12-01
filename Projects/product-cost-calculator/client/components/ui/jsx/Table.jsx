import React, { useState } from "react";
import styles from "../css/Table.module.css";
import { TableSearch } from "./TableSearch";
import { FilterOverlay } from "./FilterOverlay";
import { Button } from "..";

export function Table({
  columns = [],
  data = [],
  rowClickable = false,
  onRowClick,
  rowButtons,
  filtersConfig = [],
  onApplyFilters,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  // 🔹 Search match logic (local only)
  const searchFilteredData = data.filter((row) => {
    if (!searchText) return true;
    return columns.some((col) =>
      row[col.key]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const handleRowClick = (row, index) => {
    if (!rowClickable) return;

    setSelectedRow(index);

    if (onRowClick) onRowClick(row, index);
  };

  const isSelected = (index) => selectedRow === index;

  const updateFilterValue = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setShowFilter(false);
    if (onApplyFilters) onApplyFilters(filterValues); // Send to backend
  };

  return (
    <div className={styles.tableWrapper}>
      {/* 🔹 Search + Filters Actions */}
      <div className={styles.searchFilter}>
        <TableSearch value={searchText} onChange={setSearchText} />

        {filtersConfig.length > 0 && (
          <Button onClick={() => setShowFilter(true)}>Filters</Button>
        )}
      </div>

      {/* 🔹 Table Rendering */}
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
          {searchFilteredData.length > 0 ? (
            searchFilteredData.map((row, index) => (
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

      {/* 🔹 Filter Overlay Modal */}
      {showFilter && (
        <FilterOverlay
          filtersConfig={filtersConfig}
          values={filterValues}
          onChange={updateFilterValue}
          onApply={applyFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  );
}
