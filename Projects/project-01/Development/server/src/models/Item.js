import mongoose, { Schema, model } from "mongoose";

const historySchema = new Schema({
  phaseId: { type: Schema.Types.ObjectId, ref: "Phase" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  action: {
    type: String,
    enum: [
      "CREATE",
      "MOVE_FORWARD",
      "RETURN",
      "BULK_ADD",
      "BULK_REMOVE",
      "RETURN_ACCEPTED",
      "RETURN_REJECTED",
    ],
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
  trackingId: { type: String, required: true, unique: true }, // e.g. 000123
  templateId: { type: Schema.Types.ObjectId, ref: "ItemFormTemplate" },
  formData: { type: Object }, // store key-value per template
  currentPhaseId: { type: Schema.Types.ObjectId, ref: "Phase" },
  images: [String], // relative paths or URLs
  status: {
    type: String,
    enum: ["IN_PROGRESS", "RETURNED", "COMPLETED"],
    default: "IN_PROGRESS",
  },
  history: [historySchema],
  createdAt: { type: Date, default: Date.now },
});

export const Item = mongoose.models.Item || model("Item", itemSchema);
