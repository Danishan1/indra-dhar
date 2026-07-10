import { WorkflowService } from "../services/workflow.service.js";
import {
  workflowKeySchema,
  executionIdSchema,
  updateWorkflowSchema,
  executionQuerySchema,
} from "../validators/workflow.validator.js";
import { validate } from "../utils/validate.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const WorkflowController = {
  async list(req, res) {
    const data = await WorkflowService.list(req.user.tenant_id);

    return ApiResponse.success({
      res,
      data,
    });
  },

  async update(req, res) {
    const { key } = validate(workflowKeySchema, req.params);
    const body = validate(updateWorkflowSchema, req.body);

    console.log("DDDD : ", body, req.body)

    const result = await WorkflowService.update(req.user.tenant_id, key, body);

    return ApiResponse.success({
      res,
      data: result,
      message: "Workflow updated successfully",
    });
  },

  async executions(req, res) {
    const query = validate(executionQuerySchema, req.query);

    const data = await WorkflowService.executions(req.user.tenant_id, query);

    return ApiResponse.success({
      res,
      data,
    });
  },

  async execution(req, res) {
    const { id } = validate(executionIdSchema, req.params);

    const data = await WorkflowService.execution(req.user.tenant_id, id);

    return ApiResponse.success({
      res,
      data,
    });
  },

  async catalog(req, res) {
    const data = await WorkflowService.catalog();

    return ApiResponse.success({
      res,
      data,
    });
  },

  async install(req, res) {
    const { key } = validate(workflowKeySchema, req.params);

    const data = await WorkflowService.install({
      tenant_id: req.user.tenant_id,
      workflow_key: key,
    });

    return ApiResponse.created({
      res,
      data,
      message: "Workflow installed successfully",
    });
  },

  async remove(req, res) {
    const { key } = validate(workflowKeySchema, req.params);

    const data = await WorkflowService.remove({
      tenant_id: req.user.tenant_id,
      workflow_key: key,
    });

    return ApiResponse.success({
      res,
      data,
      message: "Workflow removed successfully",
    });
  },
};
