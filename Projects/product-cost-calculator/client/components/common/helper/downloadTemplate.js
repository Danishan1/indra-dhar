import * as XLSX from "xlsx";
import { getUploadInfo } from "./getUploadInfo";

export const downloadTemplate = (type) => {
  // Get the upload info for this type
  const info = getUploadInfo(type);

  if (!info.fields || info.fields.length === 0) {
    alert("Invalid type or no fields available.");
    return;
  }

  // Prepare header row (column names)
  const headers = info.fields.map((f) => f.key);

  // Optional: second row with accepted values as hints
  const acceptedValuesRow = info.fields.map((f) =>
    Array.isArray(f.acceptedValues)
      ? f.acceptedValues.join(", ")
      : f.acceptedValues
  );

  // Create worksheet data
  const wsData = [headers, acceptedValuesRow];

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, info.key || type);

  // Trigger download
  XLSX.writeFile(wb, `${info.key || type}_template.xlsx`);
};
