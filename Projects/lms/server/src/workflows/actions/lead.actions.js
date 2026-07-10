import { LeadRepository } from "../../repositories/lead.repository";
import { LeadService } from "../../services/lead.service";
import { WORKFLOW_ACTIONS } from "../definitions/workflow.action";
import { WORKFLOW_EVENTS } from "../definitions/workflow.events";

/**
 * ASSIGN_LEAD
 * Assign lead to user/team
 */
export async function assignLeadAction({ config, payload }) {
  const userId =
    config.user_id === "manager" ? payload.lead.manager_id : config.user_id;

  return LeadService.assign(payload.lead.id, userId, payload.user_id);
}

/**
 * UPDATE_LEAD
 * Update lead fields
 */
export async function updateLeadAction({ config, payload }) {
  return LeadRepository.update(payload.lead.id, config.fields);
}

/**
 * CHANGE_LEAD_STAGE
 * Move lead pipeline stage
 */
export async function changeStageAction({ config, payload }) {
  return LeadService.changeStage(
    payload.lead.id,
    config.stage,
    payload.user_id,
  );
}

/**
 * ADD_LEAD_NOTE
 * Add automated note
 */
export async function addNoteAction({ config, payload }) {
  return LeadService.addNote(payload.lead.id, config.note, payload.user_id);
}

/**
 * CLOSE_LEAD
 * Mark lead closed
 */
export async function closeLeadAction({ config, payload }) {
  return LeadRepository.update(payload.lead.id, {
    closed_at: new Date(),
    stage: config.stage,
  });
}

/**
 * REOPEN_LEAD
 * Reopen closed lead
 */
export async function reopenLeadAction({ payload }) {
  return LeadRepository.update(payload.lead.id, {
    closed_at: null,
  });
}

/**
 * MARK_DUPLICATE
 * Mark lead duplicate
 */
export async function markDuplicateAction({ payload }) {
  return LeadRepository.update(payload.lead.id, {
    is_duplicate: true,
  });
}

/**
 * Lead Action Registry
 */
export const LeadActions = {
  [WORKFLOW_ACTIONS.ASSIGN_LEAD]: assignLeadAction,
  [WORKFLOW_ACTIONS.UPDATE_LEAD]: updateLeadAction,
  [WORKFLOW_ACTIONS.CHANGE_LEAD_STAGE]: changeStageAction,
  [WORKFLOW_ACTIONS.ADD_LEAD_NOTE]: addNoteAction,
  [WORKFLOW_ACTIONS.CLOSE_LEAD]: closeLeadAction,
  [WORKFLOW_ACTIONS.REOPEN_LEAD]: reopenLeadAction,
  [WORKFLOW_ACTIONS.MARK_DUPLICATE]: markDuplicateAction,
};
