import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";
import { QuerygetLeadById } from "./query/getLeadById.js";

export const LeadRepository = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO leads (
      tenant_id,
      lead_number,
      first_name,
      last_name,
      company,
      mobile,
      email,
      source,
      priority,
      pipeline,
      stage,
      created_by
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING *`,
      [
        data.tenant_id,
        data.lead_number,
        data.first_name,
        data.last_name,
        data.company,
        data.mobile,
        data.email,
        data.source || "PLATFORM",
        data.priority || "MEDIUM",
        data.pipeline || "DEFAULT",
        data.stage || "NEW",
        data.created_by,
      ],
    );

    return dbResponse.single(result);
  },

  async findAll(tenantId) {
    const result = await db.query(
      `
    SELECT
      l.id,
      CONCAT_WS(' ', l.first_name, l.last_name) AS name,
      l.company,
      l.mobile AS phone,

      CONCAT_WS(' ', u.first_name, u.last_name) AS assigned,

      l.stage,

      CASE
        WHEN l.closed_at IS NOT NULL THEN 'CLOSED'
        ELSE 'OPEN'
      END AS status

    FROM leads l

    LEFT JOIN users u
      ON u.id = l.assigned_to

    WHERE l.tenant_id = $1

    ORDER BY l.created_at DESC
    `,
      [tenantId],
    );

    return dbResponse.many(result);
  },

  async findById(id) {
    const result = await db.query(QuerygetLeadById, [id]);

    return dbResponse.single(result);
  },

  async getLeadById(id) {
    return this.findById(id);
  },

  async update(id, data) {
    const result = await db.query(
      `UPDATE leads SET
      lead_number = COALESCE($2, lead_number),
      first_name = COALESCE($3, first_name),
      last_name = COALESCE($4, last_name),
      company = COALESCE($5, company),
      mobile = COALESCE($6, mobile),
      email = COALESCE($7, email),
      address = COALESCE($8, address),
      city = COALESCE($9, city),
      state = COALESCE($10, state),
      country = COALESCE($11, country),
      postal_code = COALESCE($12, postal_code),
      product_interest = COALESCE($13, product_interest),
      budget = COALESCE($14, budget),
      source = COALESCE($15, source),
      priority = COALESCE($16, priority),
      pipeline = COALESCE($17, pipeline),
      stage = COALESCE($18, stage),
      assigned_to = COALESCE($19, assigned_to),
      manager_id = COALESCE($20, manager_id),
      team_id = COALESCE($21, team_id),
      closed_at = COALESCE($22, closed_at),
      is_duplicate = COALESCE($23, is_duplicate),
      remarks = COALESCE($24, remarks),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
      [
        id,
        data.lead_number,
        data.first_name,
        data.last_name,
        data.company,
        data.mobile,
        data.email,
        data.address,
        data.city,
        data.state,
        data.country,
        data.postal_code,
        data.product_interest,
        data.budget,
        data.source,
        data.priority,
        data.pipeline,
        data.stage,
        data.assigned_to,
        data.manager_id,
        data.team_id,
        data.closed_at,
        data.is_duplicate,
        data.remarks,
      ],
    );

    return dbResponse.single(result);
  },

  async assign(leadId, userId) {
    const result = await db.query(
      `UPDATE leads SET assigned_to = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [leadId, userId],
    );

    return dbResponse.single(result);
  },

  async updateStage(leadId, stageId) {
    const result = await db.query(
      `UPDATE leads SET stage = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [leadId, stageId],
    );

    return dbResponse.single(result);
  },

  async updateStatus(leadId, status) {
    const result = await db.query(
      `UPDATE leads SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [leadId, status],
    );

    return dbResponse.single(result);
  },

  async addNote(leadId, note, userId) {
    const result = await db.query(
      `INSERT INTO lead_notes (lead_id, note, created_by)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [leadId, note, userId],
    );

    return dbResponse.single(result);
  },

  async logAssignment(leadId, fromUser, toUser) {
    const result = await db.query(
      `INSERT INTO lead_assignments
       (lead_id, from_user, to_user, created_at)
       VALUES ($1,$2,$3,NOW())
       RETURNING *`,
      [leadId, fromUser, toUser],
    );

    return dbResponse.single(result);
  },

  async getStage(leadId) {
    const result = await db.query(
      `SELECT stage
     FROM leads
     WHERE id = $1`,
      [leadId],
    );

    return dbResponse.single(result);
  },

  async logStageChange(leadId, oldStage, newStage, userId) {
    const result = await db.query(
      `INSERT INTO lead_stage_history (
      lead_id,
      old_stage,
      new_stage,
      changed_by
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
      [leadId, oldStage, newStage, userId],
    );

    return dbResponse.single(result);
  },

  async getTimeline(leadId) {
    const result = await db.query(
      `
    SELECT
      a.id,
      a.activity_type,
      a.title,
      a.description,
      a.created_at,

      json_build_object(
        'id', u.id,
        'name', CONCAT_WS(' ', u.first_name, u.last_name),
        'avatar_url', u.avatar_url
      ) AS created_by

    FROM activities a

    LEFT JOIN users u
      ON u.id = a.user_id

    WHERE a.lead_id = $1

    ORDER BY a.created_at DESC
    `,
      [leadId],
    );

    return dbResponse.many(result);
  },

  async createAttachment(data) {
    const result = await db.query(
      `INSERT INTO lead_attachments (
        lead_id, file_name, file_url,
        mime_type, file_size, uploaded_by
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        data.lead_id,
        data.file_name,
        data.file_url,
        data.mime_type,
        data.file_size,
        data.uploaded_by,
      ],
    );

    return dbResponse.single(result);
  },

  async findDuplicates({ tenant_id, lead }) {
    const result = await db.query(
      `SELECT *
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
         )`,
      [
        tenant_id,
        lead.id,
        lead.email,
        lead.mobile,
        lead.first_name,
        lead.last_name,
        lead.company,
      ],
    );

    return dbResponse.many(result);
  },

  async delete(id) {
    const result = await db.query(
      `DELETE FROM leads
     WHERE id = $1
     RETURNING *`,
      [id],
    );

    return dbResponse.single(result);
  },
  async findDuplicateLead({
    tenant_id,
    email,
    mobile,
    first_name,
    last_name,
    company,
  }) {
    const result = await db.query(
      `
    SELECT *
    FROM leads
    WHERE tenant_id = $1
      AND (
        ($2::text IS NOT NULL AND LOWER(email) = LOWER($2::text))
        OR
        ($3::text IS NOT NULL AND mobile = $3::text)
        OR
        (
          $4::text IS NOT NULL
          AND LOWER(first_name) = LOWER($4::text)
          AND LOWER(COALESCE(last_name, '')) = LOWER(COALESCE($5::text, ''))
          AND LOWER(COALESCE(company, '')) = LOWER(COALESCE($6::text, ''))
        )
      )
    ORDER BY created_at DESC
    LIMIT 1
    `,
      [
        tenant_id,
        email || null,
        mobile || null,
        first_name || null,
        last_name || null,
        company || null,
      ],
    );

    return dbResponse.single(result);
  },
};
