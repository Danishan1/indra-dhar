import mongoose, { Schema, model } from "mongoose";

const returnSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },

  // For ID-based returns
  itemIds: [{ type: Schema.Types.ObjectId, ref: "Item" }],

  // For count-based returns
  bulkGroupId: { type: String },
  count: { type: Number },

  fromPhaseId: { type: Schema.Types.ObjectId, ref: "Phase", required: true },
  toPhaseId: { type: Schema.Types.ObjectId, ref: "Phase", required: true },

  requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    default: "PENDING",
  },

  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const ReturnRequest =
  mongoose.models.ReturnRequest || model("ReturnRequest", returnSchema);
