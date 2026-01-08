import { BomMetaRepository } from "../repositories/bomMeta.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const BomMetaService = {
  async create(payload) {
    const data = sanitizeInput(payload);
    return BomMetaRepository.create({ name: data.name.trim() });
  },

  async getAll() {
    return BomMetaRepository.findAll();
  },

  async getById(id) {
    const bom = await BomMetaRepository.findById(id);
    if (!bom) throw new ApiError(404, "BOM not found");
    return bom;
  },

  async update(id, updates) {
    const existing = await BomMetaRepository.findById(id);
    if (!existing) throw new ApiError(404, "BOM not found");
    return BomMetaRepository.update(id, updates);
  },

  async delete(id) {
    return BomMetaRepository.delete(id);
  },
};
