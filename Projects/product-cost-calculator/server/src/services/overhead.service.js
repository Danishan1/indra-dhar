import { OverheadRepository } from "../repositories/overhead.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const OverheadService = {
  async createOverhead(payload) {
    const data = sanitizeInput(payload);

    if (!data.name) throw new ApiError(400, "Overhead name is required");
    if (!["fixed", "percentage"].includes(data.type))
      throw new ApiError(400, "Invalid overhead type");
    if (isNaN(parseFloat(data.value)))
      throw new ApiError(400, "Invalid overhead value");

    return OverheadRepository.create({
      name: data.name.trim(),
      type: data.type,
      value: parseFloat(data.value),
      frequency: data.frequency || "per_batch",
      is_global: data.is_global || false,
    });
  },

  async getAllOverheads(filters = {}) {
    return OverheadRepository.findAll(filters);
  },

  async getOverheadById(id) {
    const record = await OverheadRepository.findById(id);
    if (!record) throw new ApiError(404, "Overhead not found");
    return record;
  },

  async updateOverhead(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await OverheadRepository.findById(id);
    if (!existing) throw new ApiError(404, "Overhead not found");
    return OverheadRepository.update(id, sanitized);
  },

  async deleteOverhead(id) {
    const existing = await OverheadRepository.findById(id);
    if (!existing) throw new ApiError(404, "Overhead not found");
    return OverheadRepository.delete(id);
  },
};
