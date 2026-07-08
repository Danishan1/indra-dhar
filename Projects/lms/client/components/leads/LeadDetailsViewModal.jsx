"use client";

import React from "react";

import {
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
} from "lucide-react";

import styles from "./LeadDetailsViewModal.module.css";

import { Modal } from "../ui";

export default function LeadDetailsViewModal({
  open,

  lead,

  notes = [],

  timeline = [],

  attachments = [],

  onClose,
}) {
  if (!open || !lead) {
    return null;
  }

  return (
    <Modal title="Lead Details" onClose={onClose}>
      <div className={styles.container}>
        {/* Header */}

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{lead.name}</h2>

            {lead.company && <p className={styles.company}>{lead.company}</p>}
          </div>

          <div className={styles.statusGroup}>
            <span
              className={`${styles.badge} ${styles[lead.stage?.toLowerCase()]}`}
            >
              {lead.stage}
            </span>

            <span
              className={`${styles.badge} ${
                styles[lead.status?.toLowerCase()]
              }`}
            >
              {lead.status}
            </span>
          </div>
        </div>

        {/* Lead Information */}

        <div className={styles.infoCard}>
          <div className={styles.infoItem}>
            <User size={18} />

            <div>
              <span>Assigned To</span>

              <strong>{lead.assigned_name || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Building2 size={18} />

            <div>
              <span>Company</span>

              <strong>{lead.company || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Mail size={18} />

            <div>
              <span>Email</span>

              <strong>{lead.email || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Phone size={18} />

            <div>
              <span>Phone</span>

              <strong>{lead.phone || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <DollarSign size={18} />

            <div>
              <span>Estimated Value</span>

              <strong>{lead.value || "-"}</strong>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Calendar size={18} />

            <div>
              <span>Created At</span>

              <strong>
                {lead.created_at
                  ? new Date(lead.created_at).toLocaleString()
                  : "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* Description */}

        <section className={styles.section}>
          <h3>Description</h3>

          <div className={styles.description}>
            {lead.description ? lead.description : "No description available"}
          </div>
        </section>

        {/* Notes */}

        <section className={styles.section}>
          <h3>Notes</h3>

          {notes.length === 0 ? (
            <p className={styles.empty}>No notes available</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={styles.note}>
                <div className={styles.noteHeader}>
                  <strong>{note.user_name || "User"}</strong>

                  <small>
                    {note.created_at
                      ? new Date(note.created_at).toLocaleString()
                      : ""}
                  </small>
                </div>

                <p>{note.note}</p>
              </div>
            ))
          )}
        </section>

        {/* Attachments */}

        <section className={styles.section}>
          <h3>Attachments</h3>

          {attachments.length === 0 ? (
            <p className={styles.empty}>No attachments uploaded</p>
          ) : (
            attachments.map((file) => (
              <div key={file.id} className={styles.attachment}>
                <FileText size={16} />

                <span>{file.filename}</span>
              </div>
            ))
          )}
        </section>

        {/* Timeline */}

        <section className={styles.section}>
          <h3>Activity Timeline</h3>

          {timeline.length === 0 ? (
            <p className={styles.empty}>No activity found</p>
          ) : (
            timeline.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                <CheckCircle size={16} />

                <div>
                  <p>{item.action}</p>

                  <small>
                    <Clock size={12} />

                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : ""}
                  </small>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </Modal>
  );
}
