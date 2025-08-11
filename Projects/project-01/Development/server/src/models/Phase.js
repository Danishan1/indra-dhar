import mongoose, { Schema, model } from "mongoose";

const phaseSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  description: { type: String },
  name: { type: String, required: true },
  order: { type: Number, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

phaseSchema.index({ tenantId: 1, order: 1 }, { unique: true });

export const Phase = mongoose.models.Phase || model("Phase", phaseSchema);
