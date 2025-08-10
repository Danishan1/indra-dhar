import mongoose, { Schema, model } from "mongoose";

const tenantSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Tenant = mongoose.models.Tenant || model("Tenant", tenantSchema);
