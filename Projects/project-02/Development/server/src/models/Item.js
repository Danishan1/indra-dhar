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
  count: { type: Number }, // For count-based tracking
  itemIds: [{ type: Schema.Types.ObjectId, ref: "Item" }], // For ID-based tracking
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },

  // Optional for count-based bulk
  trackingId: { type: String, unique: true, sparse: true },

  isBulkCountBased: { type: Boolean, default: false }, // true => only quantity is tracked

  quantity: { type: Number, default: 1 }, // relevant only if isBulkCountBased=true

  bulkGroupId: { type: String }, // UUID or custom string for grouping same-lot items

  formData: { type: Object },
  currentPhaseId: { type: Schema.Types.ObjectId, ref: "Phase" },
  images: [String],

  status: {
    type: String,
    enum: ["IN_PROGRESS", "RETURNED", "COMPLETED"],
    default: "IN_PROGRESS",
  },

  history: [historySchema],

  createdAt: { type: Date, default: Date.now },
});

export const Item = mongoose.models.Item || model("Item", itemSchema);
