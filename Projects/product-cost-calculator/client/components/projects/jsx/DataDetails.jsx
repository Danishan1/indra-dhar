"use client";
import { Button, Table } from "@/components/ui";
import styles from "../css/DataDetails.module.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Converts snake_case, kebab-case, or camelCase to "Title Case"
 */
const formatKey = (key) => {
  return key
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
};

export function DataDetails({ data = {} }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className={styles.empty}>No data available.</p>;
  }

  console.log("DDDD DataDetails data:", data);

  /* =====================
     EXPORT: EXCEL
  ====================== */
  const exportToExcel = () => {
    const summarySheet = XLSX.utils.json_to_sheet(
      Object.entries(data.totals).map(([key, value]) => ({
        Field: formatKey(key),
        Value: value,
      }))
    );

    const itemsSheet = XLSX.utils.json_to_sheet(data.items);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");

    XLSX.writeFile(workbook, "data-details.xlsx");
  };

  /* =====================
     EXPORT: PDF
  ====================== */
  const exportToPDF = async () => {
    const element = document.getElementById("data-details-container");

    // Render the element as a canvas
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("data-details.pdf");
  };

  return (
    <div className={styles.detailsContainer} id="data-details-container">
      {/* Export Buttons */}
      <div className={styles.actions}>
        <Button onClick={exportToExcel}>Export Excel</Button>
        <Button onClick={exportToPDF}>Export PDF</Button>
      </div>
      {/* Summary */}
      <div className={styles.summary}>
        {Object.entries(data.totals).map(([key, value]) => (
          <div key={key} className={styles.row}>
            <div className={styles.key}>{formatKey(key)}</div>
            <div className={styles.value}>
              {typeof value === "string" && value.startsWith("http") ? (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              ) : (
                String(value)
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Table
        columns={[
          { key: "category", title: "Category" },
          { key: "description", title: "Description" },
          { key: "quantity_per_unit", title: "Quantity Per Unit" },
          { key: "quantity_total", title: "Quantity Total" },
          { key: "rate", title: "Unit Price" },
          { key: "amount", title: "Amount" },
          { key: "total", title: "Total" },
        ]}
        data={data.items}
      />
    </div>
  );
}
