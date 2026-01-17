"use client";

import React, { useState } from "react";
import styles from "../css/BulkUpload.module.css";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Button, SelectInput, Modal } from "@/components/ui";
import { useToast } from "..";
import { apiUtil } from "@/utils/api";
import { getUploadInfo } from "../helper/getUploadInfo";
import { downloadTemplate } from "../helper/downloadTemplate";

export function BulkUpload({ uploadOptions }) {
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const { addToast } = useToast();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);

    const ext = f.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(f, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setPreviewData(results.data),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
        setPreviewData(data);
      };
      reader.readAsBinaryString(f);
    } else if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          setPreviewData(Array.isArray(data) ? data : []);
        } catch {
          setPreviewData([]);
        }
      };
      reader.readAsText(f);
    } else {
      addToast(
        "error",
        "Unsupported file type. Please use CSV, Excel, or JSON."
      );
      setPreviewData([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedType?.value) return addToast("error", "Select upload type.");
    if (!file) return addToast("error", "Select a file to upload");

    const apiUrl = selectedType.value;
    if (!apiUrl) return addToast("error", "No API configured for this type");

    setLoading(true);
    try {
      const res = await apiUtil.post(apiUrl, previewData);
      if (res.success) {
        addToast("success", "Upload successful!");
        setPreviewData([]);
        setSelectedType(null);
        setFile(null);
      } else addToast("error", res.message || "Upload failed");
    } catch (err) {
      console.error(err);
      addToast("error", err?.response?.data?.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const uploadInfo = getUploadInfo(selectedType);

  return (
    <div className={styles.bulkUploadWrapper}>
      <h2>Bulk Upload</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SelectInput
          label="Select Type"
          placeholder="Choose type"
          options={uploadOptions}
          value={selectedType?.value || ""}
          onChange={(e) => setSelectedType(e.target)}
          required
        />
        {selectedType && (
          <div className={styles.actions}>
            <Button onClick={() => setShowInfo(true)}>Info</Button>
            <Button onClick={() => downloadTemplate(selectedType)}>⬇</Button>
          </div>
        )}
      </div>

      <input
        type="file"
        accept=".csv,.xls,.xlsx,.json"
        onChange={handleFileChange}
        className={styles.fileInput}
      />

      {previewData.length > 0 && (
        <div className={styles.previewWrapper}>
          <h3>Preview ({previewData.length} rows)</h3>
          <div className={styles.previewTable}>
            <table>
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {Object.keys(row).map((k) => (
                      <td key={k}>{row[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && <p>Showing first 5 rows</p>}
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={loading || !selectedType || !file}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>

      {/* Info Modal */}
      {showInfo && selectedType && (
        <Modal
          title={`Upload Info: ${selectedType.label}`}
          onClose={() => setShowInfo(false)}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Field</th>
                <th>Purpose</th>
                <th>Accepted Values</th>
              </tr>
            </thead>
            <tbody>
              {uploadInfo.fields.map((field) => (
                <tr key={field.key}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {field.key}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {field.purpose}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {Array.isArray(field.acceptedValues)
                      ? field.acceptedValues.join(", ")
                      : field.acceptedValues}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}
