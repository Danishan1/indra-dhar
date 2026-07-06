import { validate } from "../utils/validate.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  createIntegrationSchema,
  updateIntegrationSchema,
} from "../validators/integration.validator.js";
import { IntegrationService } from "../services/integration.service.js";

export const IntegrationController = {
  async create(req, res) {
    const tenant_id = req.user.tenant_id;

    const data = validate(createIntegrationSchema, req.body);

    const integration = await IntegrationService.create(tenant_id, data);

    return ApiResponse.created({
      res,
      data: integration,
      message: "Integration created",
    });
    return ApiResponse.error({
      res,
      message: err.message,
      errors: err.errors,
    });
  },

  async list(req, res) {
    const tenant_id = req.user.tenant_id;

    const data = await IntegrationService.list(tenant_id);

    return ApiResponse.success({
      res,
      data,
    });
  },

  async getById(req, res) {
    const tenant_id = req.user.tenant_id;

    const data = await IntegrationService.getById(req.params.id, tenant_id);

    return ApiResponse.success({ res, data });
  },

  async update(req, res) {
    const tenant_id = req.user.tenant_id;

    const data = validate(updateIntegrationSchema, req.body);

    const updated = await IntegrationService.update(
      req.params.id,
      tenant_id,
      data,
    );

    return ApiResponse.success({
      res,
      data: updated,
      message: "Integration updated",
    });
  },

  async remove(req, res) {
    const tenant_id = req.user.tenant_id;

    await IntegrationService.remove(req.params.id, tenant_id);

    return ApiResponse.noContent({ res });
  },
};
