import { BomItemRepository } from "../repositories/bomItem.repository.js";
import { BomMetaRepository } from "../repositories/bomMeta.repository.js";
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

  async createBomItemsBulk(payloads) {
    if (!Array.isArray(payloads) || !payloads.length) {
      throw new ApiError(400, "Payload must be a non-empty array");
    }

    const sanitized = [];

    for (const p of payloads) {
      const data = sanitizeInput(p);

      // Required fields
      if (!data.bom_meta_id || !data.material_id || !data.quantity) {
        throw new ApiError(
          400,
          `Missing required fields in BOM item: ${JSON.stringify(p)}`
        );
      }

      // Check if BOM meta exists
      const bomMeta = await BomMetaRepository.findById(data.bom_meta_id);
      if (!bomMeta) {
        throw new ApiError(400, `Invalid bom_meta_id: ${data.bom_meta_id}`);
      }

      // Check if material exists
      const material = await RawMaterialRepository.findById(data.material_id);
      if (!material) {
        throw new ApiError(400, `Invalid material_id: ${data.material_id}`);
      }

      // Ensure quantity is numeric (allow decimals if material allows)
      let quantity = parseFloat(data.quantity);
      if (isNaN(quantity)) {
        throw new ApiError(400, `Invalid quantity: ${data.quantity}`);
      }

      sanitized.push({
        bom_meta_id: data.bom_meta_id,
        material_id: data.material_id,
        quantity: data.quantity.toString().trim(), // keep as string for DB varchar
        decimal_allowed:
          typeof data.decimal_allowed === "boolean"
            ? data.decimal_allowed
            : true,
      });
    }

    // Call repository bulk insert
    return BomItemRepository.createBulk(sanitized);
  },
};
