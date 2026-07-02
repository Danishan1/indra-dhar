import { WorkflowRepository } from "../repositories/workflow.repository.js";
import { WorkflowEngine } from "../engine/workflow.engine.js";

export const WorkflowService = {
  async createRule(data) {
    return WorkflowRepository.createRule(data);
  },

  async listRules(tenantId) {
    return WorkflowRepository.listRules(tenantId);
  },

  async getRule(id) {
    return WorkflowRepository.getRule(id);
  },

  async updateRule(id, data) {
    return WorkflowRepository.updateRule(id, data);
  },

  async deleteRule(id) {
    return WorkflowRepository.deleteRule(id);
  },

  async addCondition(ruleId, data) {
    return WorkflowRepository.addCondition(ruleId, data);
  },

  async addAction(ruleId, data) {
    return WorkflowRepository.addAction(ruleId, data);
  },

  /**
   * CORE ENTRY POINT
   */
  async executeRule(ruleId, leadId, payload) {
    const rule = await WorkflowRepository.getFullRule(ruleId);

    return WorkflowEngine.execute(rule, leadId, payload);
  },

  async executions(filters) {
    return WorkflowRepository.getExecutions(filters);
  },
};
