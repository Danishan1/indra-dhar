import { Schema, model } from 'mongoose';

const returnSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  itemIds: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
  fromPhaseId: { type: Schema.Types.ObjectId, ref: 'Phase', required: true },
  toPhaseId: { type: Schema.Types.ObjectId, ref: 'Phase', required: true },
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED'], default: 'PENDING' },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default model('ReturnRequest', returnSchema);
