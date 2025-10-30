"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../css/DeleteConfirm.module.css";
import { DataDetails, useToast } from "..";
import { Button } from "@/components/ui";
import { apiUtil } from "@/utils/api";

// Generic delete function
export async function deleteRecord(endpoint, id) {
  try {
    const response = await apiUtil.delete(`${endpoint}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Delete failed:", error);
    const message = error.response?.data?.message || "Failed to delete record";
    return { success: false, message };
  }
}

export function DeleteConfirm({ id, endpoint, record, setSelectedId = null }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setLoading(true);
    const res = await deleteRecord(endpoint, id);
    setLoading(false);

    if (res.success) {
      addToast("success", "Record deleted successfully!");
      setSelectedId && setSelectedId(null);
      router.push(endpoint); // e.g., /vendors
    } else {
      addToast("error", res.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Confirm Deletion</h2>
      <p className={styles.warningText}>
        This action cannot be undone. Please confirm you want to delete the
        following record:
      </p>

      <DataDetails data={record} />

      <div className={styles.actions}>
        <Button variant={"outline"} onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant={"danger"}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
