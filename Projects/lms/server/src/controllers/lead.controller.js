import { LeadService } from "../services/lead.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validate } from "../utils/validate.js";

import {
  createLeadSchema,
  updateLeadSchema,
  leadIdSchema,
  assignLeadSchema,
  stageSchema,
  statusSchema,
  noteSchema,
  listLeadSchema,
} from "../validators/lead.validator.js";

export const LeadController = {
  async create(req, res, next) {
    try {
      const body = validate(createLeadSchema, req.body);

      const lead = await LeadService.create({
        tenant_id: req.user.tenant_id,
        data: { ...body, created_by: req.user.user_id },
      });

      return ApiResponse.created({
        res,
        data: lead,
        message: "Lead created successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const filters = validate(listLeadSchema, req.query);

      const leads = await LeadService.list({
        tenant_id: req.user.tenant_id,
        filters,
      });

      return ApiResponse.success({
        res,
        data: leads,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);

      const lead = await LeadService.getById(id);

      if (!lead) {
        return ApiResponse.error({
          res,
          statusCode: 404,
          message: "Lead not found",
        });
      }

      return ApiResponse.success({
        res,
        data: lead,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);
      const body = validate(updateLeadSchema, req.body);

      const lead = await LeadService.update(id, body);

      return ApiResponse.success({
        res,
        data: lead,
        message: "Lead updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);

      await LeadService.delete(id);

      return ApiResponse.noContent({ res });
    } catch (err) {
      next(err);
    }
  },

  async assign(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);
      const { to_user } = validate(assignLeadSchema, req.body);

      const result = await LeadService.assign(id, to_user, req.user.id);

      return ApiResponse.success({
        res,
        data: result,
        message: "Lead assigned successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async changeStage(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);
      const { stage } = validate(stageSchema, req.body);

      const result = await LeadService.changeStage(id, stage, req.user.id);

      return ApiResponse.success({
        res,
        data: result,
        message: "Stage updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);
      const { status } = validate(statusSchema, req.body);

      const result = await LeadService.updateStatus(id, status);

      return ApiResponse.success({
        res,
        data: result,
        message: "Status updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async addNote(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);
      const { note } = validate(noteSchema, req.body);

      const result = await LeadService.addNote(id, note, req.user.id);

      return ApiResponse.created({
        res,
        data: result,
        message: "Note added successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async timeline(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);

      const result = await LeadService.timeline(id);

      return ApiResponse.success({
        res,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async uploadAttachment(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);

      const result = await LeadService.uploadAttachment({
        tenant_id: req.user.tenant_id,
        lead_id: id,
        file: req.file,
        uploaded_by: req.user.id,
      });

      return ApiResponse.created({
        res,
        data: result,
        message: "Attachment uploaded successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  async checkDuplicates(req, res, next) {
    try {
      const { id } = validate(leadIdSchema, req.params);

      const result = await LeadService.checkDuplicates({
        tenant_id: req.user.tenant_id,
        lead_id: id,
      });

      return ApiResponse.success({
        res,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
