import { BomItemRepository } from "../repositories/bomItem.repository.js";
import { RawMaterialRepository } from "../repositories/rawMaterial.repository.js";
import { ApiError } from "../utils/ApiError.js";

export const BomItemService = {
  async create(payload) {
    const material = await RawMaterialRepository.findById(payload.material_id);
    if (!material) throw new ApiError(400, "Invalid material");

    return BomItemRepository.create(payload);
  },

  async getByBom(bomId) {
    return BomItemRepository.findByBomId(bomId);
  },
  async getOne(itemId) {
    return BomItemRepository.findByItemId(itemId);
  },

  async update(id, updates) {
    const existing = await BomItemRepository.findById(id);
    if (!existing) throw new ApiError(404, "BOM item not found");

    return BomItemRepository.update(id, updates);
  },

  async delete(id) {
    return BomItemRepository.delete(id);
  },
};
