import { WorkflowService } from "../services/workflow.service.js";

export const WorkflowController = {
  async createRule(req, res) {
    const rule = await WorkflowService.createRule({
      ...req.body,
      tenant_id: req.user.tenant_id,
    });

    res.json(rule);
  },

  async listRules(req, res) {
    const rules = await WorkflowService.listRules(req.user.tenant_id);
    res.json(rules);
  },

  async getRule(req, res) {
    const rule = await WorkflowService.getRule(req.params.id);
    res.json(rule);
  },

  async updateRule(req, res) {
    const rule = await WorkflowService.updateRule(req.params.id, req.body);
    res.json(rule);
  },

  async deleteRule(req, res) {
    const result = await WorkflowService.deleteRule(req.params.id);
    res.json(result);
  },

  async addCondition(req, res) {
    const condition = await WorkflowService.addCondition(
      req.params.id,
      req.body,
    );

    res.json(condition);
  },

  async addAction(req, res) {
    const action = await WorkflowService.addAction(req.params.id, req.body);

    res.json(action);
  },

  async executeRule(req, res) {
    const result = await WorkflowService.executeRule(
      req.params.id,
      req.body.lead_id,
      req.body.trigger_payload,
    );

    res.json(result);
  },

  async executions(req, res) {
    const logs = await WorkflowService.executions(req.query);
    res.json(logs);
  },
};
