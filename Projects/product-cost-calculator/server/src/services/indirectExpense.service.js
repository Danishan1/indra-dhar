import { IndirectExpRepository } from "../repositories/indirectExpense.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const IndirectExpenseService = {
  async createIndirectExpense(payload) {
    const data = sanitizeInput(payload);

    if (!data.name) throw new ApiError(400, "Indirect expense name is required");
    if (!["fixed", "percentage"].includes(data.type))
      throw new ApiError(400, "Invalid indirect expense type");
    if (isNaN(parseFloat(data.value)))
      throw new ApiError(400, "Invalid indirect expense value");

    return IndirectExpRepository.create({
      name: data.name.trim(),
      type: data.type,
      value: parseFloat(data.value),
      frequency: data.frequency,
    });
  },

  async getAllIndirectExpenses(filters = {}) {
    return IndirectExpRepository.findAll(filters);
  },

  async getIndirectExpenseById(id) {
    const record = await IndirectExpRepository.findById(id);
    if (!record) throw new ApiError(404, "Indirect expense not found");
    return record;
  },

  async updateIndirectExpense(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await IndirectExpRepository.findById(id);
    if (!existing) throw new ApiError(404, "Indirect expense not found");
    return IndirectExpRepository.update(id, sanitized);
  },

  async deleteIndirectExpense(id) {
    const existing = await IndirectExpRepository.findById(id);
    if (!existing) throw new ApiError(404, "Indirect expense not found");
    return IndirectExpRepository.delete(id);
  },

  async createIndirectExpBulk(payloads) {
    if (!Array.isArray(payloads) || payloads.length === 0)
      throw new Error("Payload must be a non-empty array");

    const sanitizedData = payloads.map((p) => {
      const data = sanitizeInput(p);

      if (!data.name) throw new Error("Overhead name is required");
      if (!["fixed", "percentage"].includes(data.type))
        throw new Error("Invalid overhead type");
      if (isNaN(parseFloat(data.value)))
        throw new Error("Invalid overhead value");

      return {
        name: data.name.trim(),
        type: data.type,
        value: parseFloat(data.value),
        frequency: data.frequency,
      };
    });

    return IndirectExpRepository.createBulk(sanitizedData);
  },
};
