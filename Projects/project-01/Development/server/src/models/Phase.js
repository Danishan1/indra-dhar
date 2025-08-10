import { Schema, model } from 'mongoose';

const phaseSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  sequenceOrder: { type: Number, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

phaseSchema.index({ tenantId: 1, sequenceOrder: 1 }, { unique: true });

export default model('Phase', phaseSchema);
