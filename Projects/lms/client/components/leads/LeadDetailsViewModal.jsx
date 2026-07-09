"use client";

import React, { useEffect, useState } from "react";

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
  MapPin,
  Briefcase,
} from "lucide-react";

import styles from "./LeadDetailsViewModal.module.css";

import { Modal } from "../ui";
import { LeadAPI } from "@/service";

export default function LeadDetailsViewModal({ open, lead, onClose }) {
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    if (!open || !lead?.id) return;

    const fetchLeadDetails = async () => {
      try {
        const response = await LeadAPI.getById(lead.id);

        setLeadData(response.data);
      } catch (error) {
        console.error("Failed to load lead details:", error);
      }
    };

    fetchLeadDetails();
  }, [open, lead?.id]);

  if (!open || !leadData) {
    return null;
  }

  const {
    full_name,
    company,
    stage,
    priority,
    assigned_to,
    email,
    mobile,
    budget,
    created_at,
    product_interest,
    address,
    city,
    state,
    country,
    postal_code,
    remarks,
    notes = [],
    attachments = [],
    timeline = [],
  } = leadData;

  return (
    <Modal title="Lead Details" onClose={onClose}>
      <div className={styles.container}>
        {/* Header */}

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{full_name}</h2>

            <p className={styles.company}>{company}</p>
          </div>

          <div className={styles.statusGroup}>
            <span className={`${styles.badge} ${styles[stage?.toLowerCase()]}`}>
              {stage}
            </span>

            <span className={`${styles.badge} ${styles.high}`}>{priority}</span>
          </div>
        </div>

        {/* Information */}

        <div className={styles.infoCard}>
          <Info
            icon={<User size={18} />}
            title="Assigned To"
            value={assigned_to?.name}
          />

          <Info
            icon={<Building2 size={18} />}
            title="Company"
            value={company}
          />

          <Info icon={<Mail size={18} />} title="Email" value={email} />

          <Info icon={<Phone size={18} />} title="Mobile" value={mobile} />

          <Info
            icon={<DollarSign size={18} />}
            title="Budget"
            value={`₹ ${budget || "-"}`}
          />

          <Info
            icon={<Briefcase size={18} />}
            title="Product Interest"
            value={product_interest}
          />

          <Info
            icon={<MapPin size={18} />}
            title="Location"
            value={[address, city, state].filter(Boolean).join(", ") || "-"}
          />

          <Info
            icon={<Calendar size={18} />}
            title="Created At"
            value={created_at ? new Date(created_at).toLocaleString() : "-"}
          />
        </div>

        {/* Remarks */}

        {/* <section className={styles.section}>
          <h3>Remarks</h3>

          <div className={styles.description}>
            {remarks || "No remarks available"}
          </div>
        </section> */}

        {/* Notes */}

        <section className={styles.section}>
          <h3>Notes</h3>

          {notes.length === 0 ? (
            <p className={styles.empty}>No notes available</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className={styles.note}>
                <div className={styles.noteHeader}>
                  <strong>{note.created_by?.name || "User"}</strong>

                  <small>{new Date(note.created_at).toLocaleString()}</small>
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

                <span>{file.file_name}</span>
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
                  <p>{item.type}</p>

                  <small>
                    <Clock size={12} />

                    {new Date(item.created_at).toLocaleString()}
                  </small>

                  {item.data?.remarks && <small>{item.data.remarks}</small>}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </Modal>
  );
}

function Info({ icon, title, value }) {
  return (
    <div className={styles.infoItem}>
      {icon}

      <div>
        <span>{title}</span>

        <strong>{value || "-"}</strong>
      </div>
    </div>
  );
}
