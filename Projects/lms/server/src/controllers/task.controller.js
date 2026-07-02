import { TaskService } from "../services/task.service.js";

export const TaskController = {
  async create(req, res) {
    const task = await TaskService.create({
      ...req.body,
      tenant_id: req.user.tenant_id,
      created_by: req.user.id,
    });

    res.json(task);
  },

  async list(req, res) {
    const tasks = await TaskService.list({
      tenant_id: req.user.tenant_id,
      filters: req.query,
    });

    res.json(tasks);
  },

  async getById(req, res) {
    const task = await TaskService.getById(req.params.id);
    res.json(task);
  },

  async update(req, res) {
    const task = await TaskService.update(req.params.id, req.body);
    res.json(task);
  },

  async remove(req, res) {
    const result = await TaskService.delete(req.params.id);
    res.json(result);
  },

  async assign(req, res) {
    const result = await TaskService.assign(
      req.params.id,
      req.body.assigned_to,
      req.user.id,
    );
    res.json(result);
  },

  async changeStatus(req, res) {
    const result = await TaskService.changeStatus(
      req.params.id,
      req.body.status,
      req.user.id,
    );
    res.json(result);
  },

  async setOutcome(req, res) {
    const result = await TaskService.setOutcome(
      req.params.id,
      req.body.outcome,
    );
    res.json(result);
  },

  async addComment(req, res) {
    const comment = await TaskService.addComment(
      req.params.id,
      req.body.comment,
      req.user.id,
    );
    res.json(comment);
  },

  async history(req, res) {
    const history = await TaskService.history(req.params.id);
    res.json(history);
  },

  async getComments(req, res) {
    try {
      const taskId = req.params.id;

      const comments = await TaskService.getComments({
        taskId,
        tenant_id: req.user.tenant_id,
        query: req.query,
      });

      res.json(comments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
