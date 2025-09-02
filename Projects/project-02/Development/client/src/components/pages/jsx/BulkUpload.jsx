import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { api } from "../../../api/api";
import { useToast } from "../../../context/ToastContext";
import styles from "../css/BulkUpload.module.css";
import { useNavigate } from "react-router-dom";

export default function BulkUpload() {
  const { addToast } = useToast();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      addToast("Please select a CSV or Excel file.", "error");
      return;
    }

    const reader = new FileReader();
    const ext = file.name.split(".").pop().toLowerCase();

    reader.onload = async (e) => {
      let rows = [];

      if (ext === "csv") {
        const csvData = Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
        });
        rows = csvData.data;
      } else if (ext === "xlsx" || ext === "xls") {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      } else {
        addToast("Unsupported file type. Upload CSV or Excel.", "error");
        return;
      }

      try {
        const res = await api.post("/items/bulk-create", { items: rows });
        addToast(res.data.message, "success");
        navigate("/user/view-item-list/Po");
      } catch (err) {
        console.error(err);
        addToast(err.response?.data?.message || "Bulk upload failed.", "error");
      }
    };

    if (ext === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className={styles.bulkUpload}>
      <h2>Bulk Upload Items</h2>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
