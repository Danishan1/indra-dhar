import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'PHASE_HEAD', 'OPERATOR'], default: 'OPERATOR' },
  phaseId: { type: Schema.Types.ObjectId, ref: 'Phase', default: null },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ username: 1, tenantId: 1 }, { unique: true });

export default model('User', userSchema);
