import { LaborRepository } from "../repositories/labor.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const LaborService = {
  async createLabor(payload) {
    const data = sanitizeInput(payload);

    if (!["direct", "indirect"].includes(data.type)) {
      throw new ApiError(400, "Invalid labor type. Must be 'direct' or 'indirect'");
    }

    return LaborRepository.create({
      name: data.name.trim(),
      type: data.type,
      rate_per_hour: parseFloat(data.rate_per_hour),
      overtime_rate: parseFloat(data.overtime_rate || 0),
    });
  },

  async getAllLabors(filters = {}) {
    return LaborRepository.findAll(filters);
  },

  async getLaborById(id) {
    const labor = await LaborRepository.findById(id);
    if (!labor) throw new ApiError(404, "Labor not found");
    return labor;
  },

  async updateLabor(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await LaborRepository.findById(id);
    if (!existing) throw new ApiError(404, "Labor not found");

    if (sanitized.type && !["direct", "indirect"].includes(sanitized.type)) {
      throw new ApiError(400, "Invalid labor type");
    }

    return LaborRepository.update(id, sanitized);
  },

  async deleteLabor(id) {
    const existing = await LaborRepository.findById(id);
    if (!existing) throw new ApiError(404, "Labor not found");
    return LaborRepository.delete(id);
  },
};
