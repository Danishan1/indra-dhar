import { LeadRepository } from "../../repositories/lead.repository.js";
import { LeadDuplicateService } from "./leadDuplicate.service.js";
import { LeadAssignmentService } from "./leadAssignment.service.js";
import { TaskService } from "./task.service.js";
import { LeadNotificationService } from "./leadNotification.service.js";
import { ActivityLogger } from "./activity.logger.js";
import { ACTIVITY_TYPE } from "../constants/activityTypes.js";

export const LeadWorkflowService = {
  async createLead(payload) {
    const { tenant_id, created_by, ...data } = payload;

    // 1. Normalize input (IMPORTANT FIRST STEP)
    const normalized = LeadIngestionService.normalize({
      source: payload.source,
      data: payload.data,
    });

    // 2. Attach system fields
    const enriched = {
      ...normalized,
      tenant_id: payload.tenant_id,
      created_by: payload.created_by,
      source: payload.source,
    };

    // 1. Duplicate Check
    const duplicateCheck = await LeadDuplicateService.check({
      tenant_id,
      lead: data,
    });

    // 2. Create Lead
    const lead = await LeadRepository.create({
      ...data,
      tenant_id,
      created_by,
      is_duplicate: duplicateCheck.duplicates.length > 0,
    });

    // 3. Log Lead Created
    await ActivityLogger.log({
      tenant_id,
      lead_id: lead.id,
      user_id: created_by,
      entity_type: "lead",
      entity_id: lead.id,
      activity_type: ACTIVITY_TYPE.LEAD_CREATED,
      title: "Lead Created",
      metadata: { source: data.source_id },
    });

    // 4. Assignment
    const assigned = await LeadAssignmentService.assign(lead);

    await ActivityLogger.log({
      tenant_id,
      lead_id: lead.id,
      user_id: created_by,
      entity_type: "lead",
      entity_id: lead.id,
      activity_type: ACTIVITY_TYPE.LEAD_ASSIGNED,
      title: "Lead Assigned",
      metadata: assigned,
    });

    // 5. Welcome Message
    await LeadNotificationService.sendWelcome(lead);

    await ActivityLogger.log({
      tenant_id,
      lead_id: lead.id,
      user_id: created_by,
      entity_type: "lead",
      entity_id: lead.id,
      activity_type: ACTIVITY_TYPE.WELCOME_SENT,
      title: "Welcome Sent",
    });

    // 6. First Task
    const task = await TaskService.createInitialTask(lead);

    await ActivityLogger.log({
      tenant_id,
      lead_id: lead.id,
      user_id: created_by,
      entity_type: "task",
      entity_id: task.id,
      activity_type: ACTIVITY_TYPE.TASK_CREATED,
      title: "First Task Created",
    });

    // 7. Duplicate Logging (if any)
    if (duplicateCheck.duplicates.length > 0) {
      await ActivityLogger.log({
        tenant_id,
        lead_id: lead.id,
        user_id: created_by,
        entity_type: "lead",
        entity_id: lead.id,
        activity_type: ACTIVITY_TYPE.DUPLICATE_FOUND,
        title: "Duplicate Lead Detected",
        metadata: duplicateCheck,
      });
    }

    return lead;
  },
};
