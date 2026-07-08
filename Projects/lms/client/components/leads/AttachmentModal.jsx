"use client";

import React, { useEffect, useState } from "react";

import styles from "./AttachmentModal.module.css";

import { Button, Modal } from "../ui";

import { Upload, FileText, X } from "lucide-react";

export default function AttachmentModal({
  open,

  leadId,

  loading = false,

  onSubmit,

  onClose,
}) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open) {
      setFile(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (selected) {
      setFile(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = () => {
    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append("lead_id", leadId);

    onSubmit(formData);
  };

  return (
    <Modal title="Upload Attachment" onClose={onClose}>
      <div className={styles.wrapper}>
        <label className={styles.uploadBox}>
          <Upload size={28} />

          <span>Click to select file</span>

          <small>PDF, DOC, XLS, Images supported</small>

          <input type="file" hidden onChange={handleFileChange} />
        </label>

        {file && (
          <div className={styles.fileCard}>
            <FileText size={22} />

            <div className={styles.fileInfo}>
              <strong>{file.name}</strong>

              <span>{(file.size / 1024).toFixed(2)} KB</span>
            </div>

            <button
              type="button"
              className={styles.remove}
              onClick={removeFile}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button disabled={loading || !file} onClick={handleSubmit}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
