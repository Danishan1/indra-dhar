import React, { useState, useMemo } from "react";
import styles from "../css/GenericTable.module.css";

export default function GenericTable({
  columns,
  data,
  searchPlaceholder = "Search...",
  pageSize = 10,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const handleFilterChange = (columnId, value) => {
    setFilters((prev) => ({ ...prev, [columnId]: value }));
    setPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters = Object.entries(filters).every(
        ([colId, filterVal]) => {
          if (!filterVal) return true;
          return String(row[colId])
            .toLowerCase()
            .includes(String(filterVal).toLowerCase());
        }
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div>
      {/* Search bar */}
      {/* <div className={styles.searchRow}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div> */}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className={styles.th}>
                  {col.Header}
                  {col.filter && (
                    <input
                      type="text"
                      placeholder={`Filter ${col.Header}`}
                      className={styles.filterInput}
                      value={filters[col.accessor] || ""}
                      onChange={(e) =>
                        handleFilterChange(col.accessor, e.target.value)
                      }
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={col.accessor} className={styles.td}>
                      {col.Cell ? col.Cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.noData}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={styles.button}
          >
            Prev
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className={styles.button}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


/*


import React from "react";
import GenericTable from "./GenericTable";

export default function UsersPage() {
  const columns = [
    { Header: "Name", accessor: "name", filter: true },
    { Header: "Email", accessor: "email", filter: true },
    { Header: "Role", accessor: "role", filter: true },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => <button>Edit {row.name}</button>,
    },
  ];

  const data = [
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "User" },
    { name: "Mark Lee", email: "mark@example.com", role: "Manager" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>User List</h1>
      <GenericTable columns={columns} data={data} />
    </div>
  );
}



*/