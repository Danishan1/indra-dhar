"use client";

import React, { useEffect, useMemo, useState } from "react";

import styles from "./LeadManagement.module.css";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  RefreshCcw,
  CheckCircle,
} from "lucide-react";

import { Button, SelectInput, TextInput } from "../ui";

import LeadFormModal from "./LeadFormModal";
import LeadDetailsViewModal from "./LeadDetailsViewModal";
import LeadDetailsModal from "./LeadDetailsModal";
import { LeadAPI } from "@/service";

const STAGE_OPTIONS = [
  {
    label: "All Stage",
    value: "",
  },

  {
    label: "New",
    value: "NEW",
  },

  {
    label: "Contacted",
    value: "CONTACTED",
  },

  {
    label: "Qualified",
    value: "QUALIFIED",
  },

  {
    label: "Proposal",
    value: "PROPOSAL",
  },

  {
    label: "Won",
    value: "WON",
  },

  {
    label: "Lost",
    value: "LOST",
  },
];

const STATUS_OPTIONS = [
  {
    label: "All Status",
    value: "",
  },
  {
    label: "Open",
    value: "OPEN",
  },
  {
    label: "Contacted",
    value: "CONTACTED",
  },
  {
    label: "Qualified",
    value: "QUALIFIED",
  },
  {
    label: "Lost",
    value: "LOST",
  },
  {
    label: "Won",
    value: "WON",
  },
];

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    stage_id: "",
    status: "",
  });

  /**
   * Modal states
   */

  const [createOpen, setCreateOpen] = useState(false);

  const [editLead, setEditLead] = useState(null);

  const [viewLead, setViewLead] = useState(null);

  const [actionLead, setActionLead] = useState(null);

  const [timeline, setTimeline] = useState([]);

  const [duplicates, setDuplicates] = useState([]);

  /**
   * Load Leads
   */

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);

      const response = await LeadAPI.list(filters);

      console.log("DDDD: ", response.data);

      setLeads(response.data || response);
    } catch (err) {
      setError(err.message || "Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Client filtering
   */

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const fullName =
        `${lead.first_name || ""} ${lead.last_name || ""}`.toLowerCase();

      const searchMatch =
        !filters.search ||
        fullName.includes(filters.search.toLowerCase()) ||
        lead.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(filters.search.toLowerCase());

      const stageMatch =
        !filters.stage_id || lead.stage_id === filters.stage_id;

      const statusMatch = !filters.status || lead.status === filters.status;

      return searchMatch && stageMatch && statusMatch;
    });
  }, [leads, filters]);

  /**
   * CRUD handlers
   */

  const createLead = async (data) => {
    try {
      const created = await LeadAPI.create(data);

      setLeads((prev) => [...prev, created]);

      setCreateOpen(false);
    } catch (err) {
      setError(err.message || "Create failed");
    }
  };

  const updateLead = async (data) => {
    try {
      const updated = await LeadAPI.update(editLead.id, data);

      setLeads((prev) =>
        prev.map((item) =>
          item.id === editLead.id
            ? {
                ...item,
                ...updated,
              }
            : item,
        ),
      );

      setEditLead(null);
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  const deleteLead = async (id) => {
    try {
      await LeadAPI.remove(id);

      setLeads((prev) => prev.filter((item) => item.id !== id));

      setActionLead(null);
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  /**
   * Assign
   */

  const assignLead = async (id, data) => {
    const updated = await LeadAPI.assign(id, data);

    setLeads((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
            }
          : item,
      ),
    );
  };

  /**
   * Stage change
   */

  const changeStage = async (id, data) => {
    const updated = await LeadAPI.changeStage(id, data);

    setLeads((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
            }
          : item,
      ),
    );
  };

  /**
   * Status update
   */

  const updateStatus = async (id, data) => {
    const updated = await LeadAPI.updateStatus(id, data);

    setLeads((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updated,
            }
          : item,
      ),
    );
  };

  /**
   * Add note
   */

  const addNote = async (id, data) => {
    await LeadAPI.addNote(id, data);
  };

  /**
   * Open details
   */

  const openDetails = async (lead) => {
    setActionLead(lead);

    const timelineResponse = await LeadAPI.timeline(lead.id);

    setTimeline(timelineResponse.data || timelineResponse);

    const duplicateResponse = await LeadAPI.duplicates(lead.id);

    setDuplicates(duplicateResponse.data || duplicateResponse);
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}

      <div className={styles.header}>
        <div>
          <h2>Lead Management</h2>

          <p>Manage sales leads and customer opportunities.</p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={18} />
          New Lead
        </Button>
      </div>

      {/* FILTERS */}

      <div className={styles.filters}>
        <TextInput
          placeholder="Search leads..."
          value={filters.search}
          iconLeft={<Search size={16} />}
          onChange={(e) =>
            setFilters({
              ...filters,

              search: e.target.value,
            })
          }
        />

        <SelectInput
          label=""
          placeholder="Stage"
          options={STAGE_OPTIONS}
          value={filters.stage_id}
          onChange={(e) =>
            setFilters({
              ...filters,
              stage_id: e.target.value,
            })
          }
        />

        <SelectInput
          label=""
          placeholder="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) =>
            setFilters({
              ...filters,

              status: e.target.value,
            })
          }
        />
      </div>

      {/* TABLE */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Assigned</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  {lead.name}
                </td>
                <td>{lead.company}</td>
                <td>{lead.phone || "-"}</td>
                <td>{lead.assigned || "-"}</td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[lead.stage?.toLowerCase()]}`}
                  >
                    {lead.stage || "-"}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${styles[lead.status?.toLowerCase()]}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Button variant="outline" onClick={() => setViewLead(lead)}>
                      <Eye size={16} />
                    </Button>

                    <Button variant="outline" onClick={() => setEditLead(lead)}>
                      <Pencil size={16} />
                    </Button>

                    <Button variant="outline" onClick={() => openDetails(lead)}>
                      <CheckCircle size={16} />
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => deleteLead(lead.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE */}

      <LeadFormModal
        open={createOpen}
        onSubmit={createLead}
        onClose={() => setCreateOpen(false)}
      />

      {/* EDIT */}

      <LeadFormModal
        open={!!editLead}
        lead={editLead}
        onSubmit={updateLead}
        onClose={() => setEditLead(null)}
      />

      {/* VIEW */}

      <LeadDetailsViewModal
        open={!!viewLead}
        lead={viewLead}
        onClose={() => setViewLead(null)}
      />

      {/* ACTION */}

      <LeadDetailsModal
        open={!!actionLead}
        lead={actionLead}
        timeline={timeline}
        duplicates={duplicates}
        onAssign={assignLead}
        onStageChange={changeStage}
        onStatusChange={updateStatus}
        onAddNote={addNote}
        onDelete={deleteLead}
        onClose={() => setActionLead(null)}
      />
    </div>
  );
}
