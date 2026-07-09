export const QuerygetLeadById = `
SELECT l.id,
  l.lead_number,
  l.first_name,
  l.last_name,
  CONCAT_WS(' ', l.first_name, l.last_name) AS full_name,
  l.company,
  l.mobile,
  l.email,
  l.address,
  l.city,
  l.state,
  l.country,
  l.postal_code,
  l.product_interest,
  l.budget,
  l.source,
  l.priority,
  l.pipeline,
  l.stage,
  l.remarks,
  l.is_duplicate,
  l.closed_at,
  l.created_at,
  l.updated_at,
  /*
   =========================
   Assigned User
   =========================
   */
  CASE
    WHEN assignee.id IS NULL THEN NULL
    ELSE json_build_object(
      'id',
      assignee.id,
      'name',
      CONCAT_WS(
        ' ',
        assignee.first_name,
        assignee.last_name
      ),
      'email',
      assignee.email
    )
  END AS assigned_to,
  /*
   =========================
   Manager
   =========================
   */
  CASE
    WHEN manager.id IS NULL THEN NULL
    ELSE json_build_object(
      'id',
      manager.id,
      'name',
      CONCAT_WS(
        ' ',
        manager.first_name,
        manager.last_name
      )
    )
  END AS manager,
  /*
   =========================
   Team
   =========================
   */
  CASE
    WHEN team.id IS NULL THEN NULL
    ELSE json_build_object(
      'id',
      team.id,
      'name',
      team.name
    )
  END AS team,
  /*
   =========================
   Created By
   =========================
   */
  json_build_object(
    'id',
    creator.id,
    'name',
    CONCAT_WS(
      ' ',
      creator.first_name,
      creator.last_name
    )
  ) AS created_by,
  /*
   =========================
   Notes
   =========================
   */
  COALESCE(
    (
      SELECT json_agg(
          json_build_object(
            'id',
            n.id,
            'note',
            n.note,
            'created_at',
            n.created_at,
            'created_by',
            json_build_object(
              'id',
              u.id,
              'name',
              CONCAT_WS(
                ' ',
                u.first_name,
                u.last_name
              )
            )
          )
          ORDER BY n.created_at DESC
        )
      FROM lead_notes n
        LEFT JOIN users u ON u.id = n.created_by
      WHERE n.lead_id = l.id
    ),
    '[]'
  ) AS notes,
  /*
   =========================
   Attachments
   =========================
   */
  COALESCE(
    (
      SELECT json_agg(
          json_build_object(
            'id',
            a.id,
            'file_name',
            a.file_name,
            'file_url',
            a.file_url,
            'mime_type',
            a.mime_type,
            'file_size',
            a.file_size,
            'uploaded_at',
            a.uploaded_at,
            'uploaded_by',
            json_build_object(
              'id',
              u.id,
              'name',
              CONCAT_WS(
                ' ',
                u.first_name,
                u.last_name
              )
            )
          )
          ORDER BY a.uploaded_at DESC
        )
      FROM lead_attachments a
        LEFT JOIN users u ON u.id = a.uploaded_by
      WHERE a.lead_id = l.id
    ),
    '[]'
  ) AS attachments,
  /*
   =========================
   Timeline
   =========================
   */
  COALESCE(
    (
      SELECT json_agg(
          timeline
          ORDER BY timeline.created_at DESC
        )
      FROM (
          /*
           Stage Changes
           */
          SELECT h.id,
            'STAGE_CHANGE' AS type,
            json_build_object(
              'old_stage',
              h.old_stage,
              'new_stage',
              h.new_stage,
              'remarks',
              h.remarks
            ) AS data,
            h.created_at
          FROM lead_stage_history h
          WHERE h.lead_id = l.id
          UNION ALL
          /*
           Assignments
           */
          SELECT a.id,
            'ASSIGNMENT' AS type,
            json_build_object(
              'from_user',
              a.from_user,
              'to_user',
              a.to_user,
              'reason',
              a.reason
            ) AS data,
            a.created_at
          FROM lead_assignments a
          WHERE a.lead_id = l.id
          UNION ALL
          /*
           Notes
           */
          SELECT n.id,
            'NOTE' AS type,
            json_build_object(
              'note',
              n.note
            ) AS data,
            n.created_at
          FROM lead_notes n
          WHERE n.lead_id = l.id
          UNION ALL
          /*
           Attachments
           */
          SELECT a.id,
            'ATTACHMENT' AS type,
            json_build_object(
              'file_name',
              a.file_name,
              'file_url',
              a.file_url
            ) AS data,
            a.uploaded_at AS created_at
          FROM lead_attachments a
          WHERE a.lead_id = l.id
        ) timeline
    ),
    '[]'
  ) AS timeline
FROM leads l
  LEFT JOIN users assignee ON assignee.id = l.assigned_to
  LEFT JOIN users manager ON manager.id = l.manager_id
  LEFT JOIN users creator ON creator.id = l.created_by
  LEFT JOIN teams team ON team.id = l.team_id
WHERE l.id = $1`;

/*

{
  "id": "9b1d8f7a-7f9d-4c20-9a52-4c7e9d8c1123",
  "lead_number": "LEAD-2026-00021",

  "first_name": "Rahul",
  "last_name": "Sharma",
  "full_name": "Rahul Sharma",

  "company": "ABC Industries Pvt Ltd",

  "mobile": "+91-9876543210",
  "email": "rahul@abcindustries.com",

  "address": "Sector 62",
  "city": "Noida",
  "state": "Uttar Pradesh",
  "country": "India",
  "postal_code": "201301",

  "product_interest": "Enterprise CRM",

  "budget": "500000",
  "source": "Website",
  "priority": "HIGH",
  "pipeline": "Enterprise Sales",
  "stage": "Qualified",
  "remarks": "Interested in yearly subscription.",
  "is_duplicate": false,
  "closed_at": null,
  "created_at": "2026-07-09T09:30:00.000Z",
  "updated_at": "2026-07-09T12:45:00.000Z",

  "assigned_to": {
    "id": "8a21c2f1-1111-4444-8888-123456789000",
    "name": "Amit Kumar",
    "email": "amit@company.com"
  },

  "manager": {
    "id": "7b12d3e2-2222-5555-9999-234567890111",
    "name": "Sales Manager"
  },

  "team": {
    "id": "6c23e4f3-3333-6666-aaaa-345678901222",
    "name": "Enterprise Sales Team"
  },

  "created_by": {
    "id": "5d34f5a4-4444-7777-bbbb-456789012333",
    "name": "Admin User"
  },



  "notes": [
    {
      "id": "note-001",
      "note": "Customer requested product demo next week.",
      "created_at": "2026-07-09T10:15:00.000Z",
      "created_by": {
        "id": "8a21c2f1-1111-4444-8888-123456789000",
        "name": "Amit Kumar"
      }
    },
    {
      "id": "note-002",
      "note": "Shared pricing document.",
      "created_at": "2026-07-09T11:20:00.000Z",
      "created_by": {
        "id": "5d34f5a4-4444-7777-bbbb-456789012333",
        "name": "Admin User"
      }
    }
  ],



  "attachments": [
    {
      "id": "attachment-001",
      "file_name": "company-profile.pdf",
      "file_url": "/uploads/leads/company-profile.pdf",
      "mime_type": "application/pdf",
      "file_size": 245678,
      "uploaded_at": "2026-07-09T10:30:00.000Z",
      "uploaded_by": {
        "id": "8a21c2f1-1111-4444-8888-123456789000",
        "name": "Amit Kumar"
      }
    },
    {
      "id": "attachment-002",
      "file_name": "quotation.xlsx",
      "file_url": "/uploads/leads/quotation.xlsx",
      "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "file_size": 98765,
      "uploaded_at": "2026-07-09T12:00:00.000Z",
      "uploaded_by": {
        "id": "5d34f5a4-4444-7777-bbbb-456789012333",
        "name": "Admin User"
      }
    }

  ],



  "timeline": [
    {
      "id": "timeline-001",
      "type": "STAGE_CHANGE",
      "data": {
        "old_stage": "NEW",
        "new_stage": "CONTACTED",
        "remarks": "Initial discussion completed"
      },
      "created_at": "2026-07-09T09:45:00.000Z"
    },
    {
      "id": "timeline-002",
      "type": "ASSIGNMENT",
      "data": {
        "from_user": null,
        "to_user": "8a21c2f1-1111-4444-8888-123456789000",
        "reason": "Assigned after lead creation"

      },
      "created_at": "2026-07-09T09:50:00.000Z"
    },
    {
      "id": "timeline-003",
      "type": "NOTE",
      "data": {
        "note": "Customer requested product demo next week."
      },
      "created_at": "2026-07-09T10:15:00.000Z"
    },


    {
      "id": "timeline-004",
      "type": "ATTACHMENT",
      "data": {
        "file_name": "company-profile.pdf",
        "file_url": "/uploads/leads/company-profile.pdf"
      },
      "created_at": "2026-07-09T10:30:00.000Z"
    },


    {
      "id": "timeline-005",
      "type": "STAGE_CHANGE",
      "data": {
        "old_stage": "CONTACTED",
        "new_stage": "QUALIFIED",
        "remarks": "Budget confirmed"
      },
      "created_at": "2026-07-09T12:30:00.000Z"
    }
  ]
}


*/
