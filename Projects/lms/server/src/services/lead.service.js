import { LeadRepository } from "../repositories/lead.repository.js";
import { LeadWorkflowService } from "./lead/leadWorkflow.service.js";

export const LeadService = {
  async create({ tenant_id, data }) {
    return LeadWorkflowService.process({
      tenant_id,
      source: "PLATFORM",
      data: data,
    });
  },

  async list({ tenant_id, filters }) {
    return LeadRepository.findAll(tenant_id, filters);
  },

  async getById(id) {
    return LeadRepository.findById(id);
  },

  async update(id, data) {
    return LeadRepository.update(id, data);
  },

  async delete(id) {
    return LeadRepository.delete(id);
  },

  async assign(leadId, toUserId, assignedBy) {
    // 1. update lead
    await LeadRepository.assign(leadId, toUserId);

    // 2. log assignment
    await LeadRepository.logAssignment(leadId, assignedBy, toUserId);

    return { success: true };
  },

  async changeStage(leadId, stage, userId) {
    const oldStage = await LeadRepository.getStage(leadId);

    await LeadRepository.updateStage(leadId, stage);

    await LeadRepository.logStageChange(leadId, oldStage, stage, userId);

    return { success: true };
  },

  async updateStatus(leadId, status) {
    return LeadRepository.updateStatus(leadId, status);
  },

  async addNote(leadId, note, userId) {
    return LeadRepository.addNote(leadId, note, userId);
  },

  async timeline(leadId) {
    return LeadRepository.getTimeline(leadId);
  },

  async uploadAttachment({ tenant_id, lead_id, file, uploaded_by }) {
    if (!file) throw new Error("No file provided");

    const lead = await LeadRepository.getLeadById(lead_id, tenant_id);
    if (!lead) throw new Error("Lead not found");

    // file.url assumed from multer/cloud storage
    const attachment = await LeadRepository.createAttachment({
      lead_id,
      file_name: file.originalname,
      file_url: file.path || file.location,
      mime_type: file.mimetype,
      file_size: file.size,
      uploaded_by,
    });

    return attachment;
  },

  /**
   * Duplicate detection
   */
  async checkDuplicates({ tenant_id, lead_id }) {
    const lead = await LeadRepository.findById(lead_id, tenant_id);
    if (!lead) throw new Error("Lead not found");

    const duplicates = await LeadRepository.findDuplicates({
      tenant_id,
      lead,
    });

    return {
      lead_id,
      duplicates,
      count: duplicates.length,
    };
  },
};
