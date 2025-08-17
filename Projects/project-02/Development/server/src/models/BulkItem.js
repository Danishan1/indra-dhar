import mongoose, { Schema, model } from "mongoose";

const bulkItem = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  phaseId: { type: Schema.Types.ObjectId, ref: "Phase", required: true },

  // Option 1: If you're grouping actual items
  pendingItemIds: [
    { type: Schema.Types.ObjectId, ref: "Item", required: true },
  ],
  completedItemIds: [
    { type: Schema.Types.ObjectId, ref: "Item", required: true },
  ],

  status: {
    type: String,
    enum: ["IN_PROGRESS", "RETURNED", "COMPLETED", "RETURNED_COMPLETED"],
    default: "IN_PROGRESS",
  },
  createdAt: { type: Date, default: Date.now },
});

export const BulkItem = mongoose.models.BulkItem || model("BulkItem", bulkItem);
