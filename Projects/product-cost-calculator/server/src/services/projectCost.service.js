import { ProjectCostRepository } from "../repositories/projectCost.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { CostCalculationService } from "./costCalculation.service.js";

export const ProjectCostService = {
  async createProjectWithHistory(payload) {
    const data = payload.data || [];
    const meta = payload.meta || [];

    if (!meta.project_name) throw new ApiError(400, "Project name is required");

    if (!Array.isArray(data) || data.length === 0)
      throw new ApiError(400, "Resource items are required");

    // Calculate final cost
    const result = await CostCalculationService.calculate(payload);

    if (!result.success) {
      throw new ApiError(400, result.message);
    }

    const total_cost = result.data;

    // Insert project
    const project = await ProjectCostRepository.createProject({
      project_name: meta.project_name,
      profit_value: meta.profit_value,
      profit_type: meta.profit_type,
      project_gst: meta.project_gst,
      product_type: meta.product_type,
      project_progress: meta.project_progress,
      production_quantity: meta.production_quantity,
      total_cost: total_cost,
    });

    // Insert related inputs
    await ProjectCostRepository.addProjectItems(project.id, data);

    return { ...project, total_cost };
  },

  async getProjectHistory(id) {
    const project = await ProjectCostRepository.findProjectWithItems(id);
    if (!project) throw new ApiError(404, "Project history not found");

    return project;
  },

  async getAllProjects(filters = {}) {
    return ProjectCostRepository.findAllProjects(filters);
  },

  async deleteProject(id) {
    const project = await ProjectCostRepository.findProjectById(id);
    if (!project) throw new ApiError(404, "Project not found");

    return ProjectCostRepository.deleteProject(id);
  },
  async updateImage(project_id, image_url) {
    const project = await ProjectCostRepository.findProjectById(project_id);
    if (!project) throw new ApiError(404, "Project not found");

    await ProjectCostRepository.updateImage(project_id, image_url);

    return { project_id, image_url };
  },
};
