import { TaskService } from "../services/task.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validate } from "../utils/validate.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  changeStatusSchema,
  outcomeSchema,
  commentSchema,
  taskCommentQuerySchema,
  idParamSchema,
} from "../validators/task.validation.js";

export const TaskController = {
  async create(req, res) {
    const body = validate(createTaskSchema, req.body);

    const task = await TaskService.create({
      ...body,
      tenant_id: req.user.tenant_id,
      created_by: req.user.id,
    });

    return ApiResponse.created({
      res,
      data: task,
      message: "Task created successfully",
    });
  },

  async list(req, res) {
    const tasks = await TaskService.list({
      tenant_id: req.user.tenant_id,
      filters: req.query,
    });

    return ApiResponse.success({
      res,
      data: tasks,
      message: "Tasks fetched successfully",
    });
  },

  async getById(req, res) {
    const { id } = validate(idParamSchema, req.params);

    const task = await TaskService.getById(id);

    return ApiResponse.success({
      res,
      data: task,
      message: "Task fetched successfully",
    });
  },

  async update(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const body = validate(updateTaskSchema, req.body);

    const task = await TaskService.update(id, body);

    return ApiResponse.success({
      res,
      data: task,
      message: "Task updated successfully",
    });
  },

  async remove(req, res) {
    const { id } = validate(idParamSchema, req.params);

    await TaskService.delete(id);

    return ApiResponse.noContent({ res });
  },

  async assign(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const body = validate(assignTaskSchema, req.body);

    await TaskService.assign(id, body.assigned_to, req.user.id);

    return ApiResponse.success({
      res,
      message: "Task assigned successfully",
    });
  },

  async changeStatus(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const body = validate(changeStatusSchema, req.body);

    await TaskService.changeStatus(id, body.status, req.user.id);

    return ApiResponse.success({
      res,
      message: "Task status updated successfully",
    });
  },

  async setOutcome(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const body = validate(outcomeSchema, req.body);

    const task = await TaskService.setOutcome(id, body.outcome);

    return ApiResponse.success({
      res,
      data: task,
      message: "Task outcome updated successfully",
    });
  },

  async addComment(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const body = validate(commentSchema, req.body);

    const comment = await TaskService.addComment(id, body.comment, req.user.id);

    return ApiResponse.created({
      res,
      data: comment,
      message: "Comment added successfully",
    });
  },

  async history(req, res) {
    const { id } = validate(idParamSchema, req.params);

    const history = await TaskService.history(id);

    return ApiResponse.success({
      res,
      data: history,
      message: "Task history fetched successfully",
    });
  },

  async getComments(req, res) {
    const { id } = validate(idParamSchema, req.params);
    const query = validate(taskCommentQuerySchema, req.query);

    const comments = await TaskService.getComments({
      taskId: id,
      tenant_id: req.user.tenant_id,
      query,
    });

    return ApiResponse.success({
      res,
      data: comments.data,
      meta: comments.pagination,
      message: "Comments fetched successfully",
    });
  },
};
