import { Schema, model } from 'mongoose';

const tenantSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model('Tenant', tenantSchema);
