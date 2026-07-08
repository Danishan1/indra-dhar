"use client";

import React, { useState } from "react";

import {
  UserPlus,
  RefreshCcw,
  MessageSquare,
  FileText,
  Upload,
  Trash2,
  CheckCircle,
} from "lucide-react";

import { Button, Modal } from "../ui";

import AssignLeadModal from "./AssignLeadModal";
import ChangeLeadStageModal from "./ChangeLeadStageModal";
import ChangeLeadStatusModal from "./ChangeLeadStatusModal";
import NoteModal from "./NoteModal";
import AttachmentModal from "./AttachmentModal.jsx";

import styles from "./LeadDetailsModal.module.css";

export default function LeadDetailsModal({
  open,

  lead,

  users = [],

  timeline = [],

  notes = [],

  attachments = [],

  loading = false,

  onAssign,

  onStageChange,

  onStatusChange,

  onAddNote,

  onUploadAttachment,

  onDelete,

  onClose,
}) {
  const [assignOpen, setAssignOpen] = useState(false);

  const [stageOpen, setStageOpen] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);

  const [noteOpen, setNoteOpen] = useState(false);

  const [attachmentOpen, setAttachmentOpen] = useState(false);

  if (!open || !lead) {
    return null;
  }

  return (
    <>
      <Modal title="Lead Details" onClose={onClose}>
        <div className={styles.container}>
          {/* Header */}

          <div className={styles.header}>
            <div>
              <h2>{lead.name}</h2>

              <p className={styles.muted}>{lead.company || "No company"}</p>
            </div>

            <div className={styles.badges}>
              <span
                className={`${styles.badge} ${styles[lead.stage?.toLowerCase()]}`}
              >
                {lead.stage}
              </span>

              <span
                className={`${styles.badge} ${styles[lead.status?.toLowerCase()]}`}
              >
                {lead.status}
              </span>
            </div>
          </div>

          {/* Information */}

          <div className={styles.infoGrid}>
            <div>
              <label>Email</label>

              <p>{lead.email || "-"}</p>
            </div>

            <div>
              <label>Phone</label>

              <p>{lead.phone || "-"}</p>
            </div>

            <div>
              <label>Assigned To</label>

              <p>{lead.assigned_name || "-"}</p>
            </div>

            <div>
              <label>Source</label>

              <p>{lead.source || "-"}</p>
            </div>

            <div>
              <label>Value</label>

              <p>{lead.value || "-"}</p>
            </div>

            <div>
              <label>Created</label>

              <p>
                {lead.created_at
                  ? new Date(lead.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          {/* Description */}

          {lead.description && (
            <section className={styles.section}>
              <h3>Description</h3>

              <p className={styles.description}>{lead.description}</p>
            </section>
          )}

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

            <Button variant="outline" onClick={() => setStatusOpen(true)}>
              <CheckCircle size={16} />
              Status
            </Button>

            <Button variant="outline" onClick={() => setNoteOpen(true)}>
              <MessageSquare size={16} />
              Note
            </Button>

            <Button variant="outline" onClick={() => setAttachmentOpen(true)}>
              <Upload size={16} />
              Upload
            </Button>

            <Button variant="danger" onClick={() => onDelete(lead.id)}>
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
                  <strong>{note.user_name || "User"}</strong>

                  <p>{note.note}</p>

                  <small>{note.created_at}</small>
                </div>
              ))
            )}
          </section>

          {/* Attachments */}

          <section className={styles.section}>
            <h3>Attachments</h3>

            {attachments.length === 0 ? (
              <p className={styles.empty}>No attachments</p>
            ) : (
              attachments.map((file) => (
                <div key={file.id} className={styles.file}>
                  📎 {file.filename}
                </div>
              ))
            )}
          </section>

          {/* Timeline */}

          <section className={styles.section}>
            <h3>Timeline</h3>

            {timeline.map((item) => (
              <div key={item.id} className={styles.timeline}>
                <CheckCircle size={15} />

                <div>
                  <p>{item.action}</p>

                  <small>{item.created_at}</small>
                </div>
              </div>
            ))}
          </section>
        </div>
      </Modal>

      <AssignLeadModal
        open={assignOpen}
        users={users}
        currentUser={lead.assigned_to}
        onSubmit={(data) => {
          onAssign(lead.id, data);

          setAssignOpen(false);
        }}
        onClose={() => setAssignOpen(false)}
      />

      <ChangeLeadStageModal
        open={stageOpen}
        currentStage={lead.stage}
        onSubmit={(data) => {
          onStageChange(lead.id, data);

          setStageOpen(false);
        }}
        onClose={() => setStageOpen(false)}
      />

      <ChangeLeadStatusModal
        open={statusOpen}
        currentStatus={lead.status}
        onSubmit={(data) => {
          onStatusChange(lead.id, data);

          setStatusOpen(false);
        }}
        onClose={() => setStatusOpen(false)}
      />

      <NoteModal
        open={noteOpen}
        leadId={lead.id}
        onSubmit={(data) => {
          onAddNote(lead.id, data);

          setNoteOpen(false);
        }}
        onClose={() => setNoteOpen(false)}
      />

      <AttachmentModal
        open={attachmentOpen}
        leadId={lead.id}
        onSubmit={(file) => {
          onUploadAttachment(lead.id, file);

          setAttachmentOpen(false);
        }}
        onClose={() => setAttachmentOpen(false)}
      />
    </>
  );
}
