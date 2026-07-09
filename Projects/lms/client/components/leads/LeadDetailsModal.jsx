"use client";

import React, { useEffect, useState } from "react";

import {
  UserPlus,
  RefreshCcw,
  MessageSquare,
  Upload,
  Trash2,
  CheckCircle,
  User,
  Building2,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";

import { Button, Modal } from "../ui";
import { LeadAPI } from "@/service";

import AssignLeadModal from "./AssignLeadModal";
import ChangeLeadStageModal from "./ChangeLeadStageModal";
import ChangeLeadStatusModal from "./ChangeLeadStatusModal";
import NoteModal from "./NoteModal";
import AttachmentModal from "./AttachmentModal.jsx";

import styles from "./LeadDetailsModal.module.css";
import { getBackEndRoute } from "@/utils/api";

export default function LeadDetailsModal({
  open,
  lead,
  users = [],
  onAssign,
  onStageChange,
  onStatusChange,
  onAddNote,
  onDelete,
  onClose,
}) {
  const [leadData, setLeadData] = useState(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);

  useEffect(() => {
    if (!open || !lead?.id) return;

    const fetchLead = async () => {
      try {
        const response = await LeadAPI.getById(lead.id);
        setLeadData(response.data);
      } catch (error) {
        console.error("Failed loading lead details:", error);
      }
    };

    fetchLead();
  }, [open, lead?.id]);

  const handleUploadAttachment = async (leadId, file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await LeadAPI.uploadAttachment(leadId, formData);

      // refresh lead details if needed
      const updatedLead = await LeadAPI.getById(leadId);
      // setSelectedLead(updatedLead.data);

      // optional toast
      // toast.success("Attachment uploaded successfully");
    } catch (error) {
      console.error("Failed uploading attachment:", error);

      // optional toast
      // toast.error("Failed to upload attachment");
    }
  };

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
    remarks,
    notes = [],
    attachments = [],
    timeline = [],
  } = leadData;

  return (
    <>
      <Modal title="Lead Details" onClose={onClose}>
        <div className={styles.container}>
          {/* Header */}

          <div className={styles.header}>
            <div>
              <h2>{full_name}</h2>
              <p className={styles.muted}>{company || "No company"}</p>
            </div>

            <div className={styles.badges}>
              <span
                className={`${styles.badge} ${styles[stage?.toLowerCase()]}`}
              >
                {stage}
              </span>

              <span
                className={`${styles.badge} ${styles[priority?.toLowerCase()]}`}
              >
                {priority}
              </span>
            </div>
          </div>

          {/* Information */}

          <div className={styles.infoGrid}>
            <Info
              icon={<User size={16} />}
              label="Assigned To"
              value={assigned_to?.name}
            />

            <Info
              icon={<Building2 size={16} />}
              label="Company"
              value={company}
            />

            <Info icon={<Mail size={16} />} label="Email" value={email} />

            <Info icon={<Phone size={16} />} label="Mobile" value={mobile} />

            <Info
              icon={<DollarSign size={16} />}
              label="Budget"
              value={`₹ ${budget || "-"}`}
            />

            <Info
              icon={<Briefcase size={16} />}
              label="Product Interest"
              value={product_interest}
            />

            <Info
              icon={<MapPin size={16} />}
              label="Location"
              value={[address, city, state].filter(Boolean).join(", ")}
            />

            <Info
              icon={<Calendar size={16} />}
              label="Created"
              value={created_at ? new Date(created_at).toLocaleString() : "-"}
            />
          </div>

          {/* Remarks */}

          {/* <section className={styles.section}>
            <h3>Remarks</h3>

            <p className={styles.description}>
              {remarks || "No remarks available"}
            </p>
          </section> */}

          {/* Actions */}

          <div className={styles.actions}>
            <Button variant="outline" onClick={() => setAssignOpen(true)}>
              <UserPlus size={16} />
              Assign
            </Button>

            <Button variant="outline" onClick={() => setStageOpen(true)}>
              <RefreshCcw size={16} />
              Stage
            </Button>

            {/* <Button variant="outline" onClick={() => setStatusOpen(true)}>
              <CheckCircle size={16} />
              Status
            </Button> */}

            <Button variant="outline" onClick={() => setNoteOpen(true)}>
              <MessageSquare size={16} />
              Note
            </Button>

            <Button variant="outline" onClick={() => setAttachmentOpen(true)}>
              <Upload size={16} />
              Upload
            </Button>

            <Button variant="danger" onClick={() => onDelete(leadData.id)}>
              <Trash2 size={16} />
              Delete
            </Button>
          </div>

          {/* Notes */}

          <section className={styles.section}>
            <h3>Notes</h3>

            {notes.length === 0 ? (
              <p className={styles.empty}>No notes available</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className={styles.note}>
                  <strong>{note.created_by?.name || "User"}</strong>

                  <p>{note.note}</p>

                  <small>{new Date(note.created_at).toLocaleString()}</small>
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
                <a
                  key={file.id}
                  href={getBackEndRoute(file.file_url)}
                  download={file.file_name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.file}
                >
                  <FileText size={16} />
                  <span>{file.file_name}</span>
                </a>
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
                <div key={item.id} className={styles.timeline}>
                  <CheckCircle size={15} />

                  <div>
                    <p>{item.type}</p>

                    <small>{new Date(item.created_at).toLocaleString()}</small>

                    {item.data?.remarks && <small>{item.data.remarks}</small>}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </Modal>

      <AssignLeadModal
        open={assignOpen}
        users={users}
        currentUser={assigned_to}
        onSubmit={(data) => {
          onAssign(leadData.id, data);
          setAssignOpen(false);
        }}
        onClose={() => setAssignOpen(false)}
      />

      <ChangeLeadStageModal
        open={stageOpen}
        currentStage={stage}
        onSubmit={(data) => {
          onStageChange(leadData.id, data);
          setStageOpen(false);
        }}
        onClose={() => setStageOpen(false)}
      />

      <ChangeLeadStatusModal
        open={statusOpen}
        currentStatus={priority}
        onSubmit={(data) => {
          onStatusChange(leadData.id, data);
          setStatusOpen(false);
        }}
        onClose={() => setStatusOpen(false)}
      />

      <NoteModal
        open={noteOpen}
        leadId={leadData.id}
        onSubmit={(data) => {
          onAddNote(leadData.id, data);
          setNoteOpen(false);
        }}
        onClose={() => setNoteOpen(false)}
      />

      <AttachmentModal
        open={attachmentOpen}
        leadId={leadData.id}
        onSubmit={(file) => {
          handleUploadAttachment(leadData.id, file);
          setAttachmentOpen(false);
        }}
        onClose={() => setAttachmentOpen(false)}
      />
    </>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className={styles.infoItem}>
      {icon}

      <div>
        <label>{label}</label>
        <p>{value || "-"}</p>
      </div>
    </div>
  );
}
