import { db } from "../config/db.js";

export const LeadRepository = {
  async create(data) {
    return db.query(
      `INSERT INTO leads
      (tenant_id, lead_number, first_name, last_name, company, mobile, email, source_id, priority_id, pipeline_id, stage_id, created_by)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        data.tenant_id,
        data.lead_number,
        data.first_name,
        data.last_name,
        data.company,
        data.mobile,
        data.email,
        data.source_id,
        data.priority_id,
        data.pipeline_id,
        data.stage_id,
        data.created_by,
      ],
    );
  },

  async findAll(tenantId, filters) {
    return db.query(
      `SELECT * FROM leads
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId],
    );
  },

  async findById(id) {
    return db.query(`SELECT * FROM leads WHERE id = $1`, [id]);
  },

  async update(id, data) {
    return db.query(
      `UPDATE leads SET
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        company = COALESCE($4, company),
        mobile = COALESCE($5, mobile),
        email = COALESCE($6, email),
        updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        data.first_name,
        data.last_name,
        data.company,
        data.mobile,
        data.email,
      ],
    );
  },

  async assign(leadId, userId) {
    return db.query(
      `UPDATE leads SET assigned_to = $2, updated_at = NOW()
       WHERE id = $1`,
      [leadId, userId],
    );
  },

  async updateStage(leadId, stageId) {
    return db.query(
      `UPDATE leads SET stage_id = $2, updated_at = NOW()
       WHERE id = $1`,
      [leadId, stageId],
    );
  },

  async updateStatus(leadId, status) {
    return db.query(
      `UPDATE leads SET status = $2, updated_at = NOW()
       WHERE id = $1`,
      [leadId, status],
    );
  },

  async addNote(leadId, note, userId) {
    return db.query(
      `INSERT INTO lead_notes (lead_id, note, created_by)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [leadId, note, userId],
    );
  },

  async logAssignment(leadId, fromUser, toUser) {
    return db.query(
      `INSERT INTO lead_assignments
       (lead_id, from_user, to_user, created_at)
       VALUES ($1,$2,$3,NOW())`,
      [leadId, fromUser, toUser],
    );
  },

  async logStageChange(leadId, oldStage, newStage, userId) {
    return db.query(
      `INSERT INTO lead_stage_history
       (lead_id, old_stage_id, new_stage_id, changed_by)
       VALUES ($1,$2,$3,$4)`,
      [leadId, oldStage, newStage, userId],
    );
  },

  async getTimeline(leadId) {
    return db.query(
      `SELECT * FROM activities
       WHERE lead_id = $1
       ORDER BY created_at DESC`,
      [leadId],
    );
  },

  async createAttachment(data) {
    const query = `
    INSERT INTO lead_attachments (
      lead_id, file_name, file_url,
      mime_type, file_size, uploaded_by
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

    const values = [
      data.lead_id,
      data.file_name,
      data.file_url,
      data.mime_type,
      data.file_size,
      data.uploaded_by,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findDuplicates({ tenant_id, lead }) {
    const query = `
    SELECT *
    FROM leads
    WHERE tenant_id = $1
      AND id != $2
      AND (
        LOWER(email) = LOWER($3)
        OR mobile = $4
        OR (
          LOWER(first_name) = LOWER($5)
          AND LOWER(last_name) = LOWER($6)
          AND LOWER(company) = LOWER($7)
        )
      )
  `;

    const values = [
      tenant_id,
      lead.id,
      lead.email,
      lead.mobile,
      lead.first_name,
      lead.last_name,
      lead.company,
    ];

    const result = await db.query(query, values);
    return result.rows;
  },
};
