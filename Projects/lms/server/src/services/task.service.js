import { TaskRepository } from "../repositories/task.repository.js";

export const TaskService = {
  async create(data) {
    return TaskRepository.create(data);
  },

  async list({ tenant_id, filters }) {
    return TaskRepository.findAll(tenant_id, filters);
  },

  async getById(id) {
    return TaskRepository.findById(id);
  },

  async update(id, data) {
    return TaskRepository.update(id, data);
  },

  async delete(id) {
    return TaskRepository.delete(id);
  },

  async assign(taskId, assignedTo, changedBy) {
    const old = await TaskRepository.getAssigned(taskId);

    await TaskRepository.assign(taskId, assignedTo);

    await TaskRepository.logHistory(taskId, {
      old_assigned_to: old,
      new_assigned_to: assignedTo,
      changed_by: changedBy,
    });

    return { success: true };
  },

  async changeStatus(taskId, status, userId) {
    const old = await TaskRepository.getStatus(taskId);

    await TaskRepository.updateStatus(taskId, status);

    await TaskRepository.logHistory(taskId, {
      old_status: old,
      new_status: status,
      changed_by: userId,
    });

    /**
     * CRM HOOK (important)
     * This is where workflow engine will later plug in:
     * - TASK_COMPLETED
     * - TASK_OVERDUE
     */
    return { success: true };
  },

  async setOutcome(taskId, outcome) {
    return TaskRepository.setOutcome(taskId, outcome);
  },

  async addComment(taskId, comment, userId) {
    return TaskRepository.addComment(taskId, comment, userId);
  },

  async history(taskId) {
    return TaskRepository.getHistory(taskId);
  },

  async getComments({ taskId, tenant_id, query }) {
    const limit = Number(query.limit || 50);
    const offset = Number(query.offset || 0);

    const data = await TaskRepository.getComments({
      taskId,
      tenant_id,
      limit,
      offset,
    });

    return {
      data,
      pagination: { limit, offset },
    };
  },
};
