import { ActivityRepository } from "../repositories/activity.repository.js";

export const ACTIVITY_TYPE = {
  LEAD_CREATED: "LEAD_CREATED",
  LEAD_ASSIGNED: "LEAD_ASSIGNED",
  LEAD_UPDATED: "LEAD_UPDATED",
  STAGE_CHANGED: "STAGE_CHANGED",
  NOTE_ADDED: "NOTE_ADDED",
  ATTACHMENT_UPLOADED: "ATTACHMENT_UPLOADED",

  TASK_CREATED: "TASK_CREATED",
  WELCOME_SENT: "WELCOME_SENT",

  DUPLICATE_FOUND: "DUPLICATE_FOUND",
};

export const ActivityLogger = {
  async log({
    tenant_id,
    lead_id = null,
    user_id = null,
    entity_type,
    entity_id = null,
    activity_type,
    title = null,
    description = null,
    old_value = null,
    new_value = null,
    metadata = null,
    source = "SYSTEM",
  }) {
    return ActivityRepository.create({
      tenant_id,
      lead_id,
      user_id,
      entity_type,
      entity_id,
      activity_type,
      title,
      description,
      old_value,
      new_value,
      metadata,
      source,
    });
  },
};
