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


/*

import React, { useState } from "react";
import { Table } from "../components/Table/Table";

export default function ProductList() {
  const [products, setProducts] = useState([
    { id: 101, name: "Wireless Mouse", category: "Accessories", price: 799, stock: 45 },
    { id: 102, name: "Mechanical Keyboard", category: "Accessories", price: 2499, stock: 20 },
    { id: 103, name: "Gaming Laptop", category: "Electronics", price: 89999, stock: 5 },
    { id: 104, name: "USB-C Hub", category: "Accessories", price: 1499, stock: 10 },
  ]);

  // ✅ Define columns for the table
  const columns = [
    { key: "id", title: "Product ID" },
    { key: "name", title: "Name" },
    { key: "category", title: "Category" },
    {
      key: "price",
      title: "Price",
      render: (value) => <span>₹{value.toLocaleString()}</span>,
    },
    {
      key: "stock",
      title: "Stock",
      render: (value) => (
        <span
          style={{
            color: value < 10 ? "red" : "green",
            fontWeight: value < 10 ? 600 : 400,
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  // ✅ Define action buttons for each row
  const rowButtons = (row) => [
    {
      label: "View",
      className: "btn-view",
      onClick: (data) => alert(`Viewing: ${data.name}`),
    },
    {
      label: "Edit",
      className: "btn-edit",
      onClick: (data) => alert(`Editing: ${data.name}`),
    },
    {
      label: "Delete",
      className: "btn-delete",
      onClick: (data) => {
        if (window.confirm(`Delete product: ${data.name}?`)) {
          setProducts((prev) => prev.filter((p) => p.id !== data.id));
        }
      },
    },
  ];

  // ✅ Handle row click (single selection)
  const handleRowClick = (row) => {
    console.log("Selected product:", row);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Inventory</h2>
      <p style={{ color: "#666" }}>
        Click a row to select it or use the action buttons to manage products.
      </p>

      <Table
        columns={columns}
        data={products}
        rowClickable
        onRowClick={handleRowClick}
        rowButtons={rowButtons}
      />
    </div>
  );
}




*/