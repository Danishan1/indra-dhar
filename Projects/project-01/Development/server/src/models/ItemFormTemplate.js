import { Schema, model } from 'mongoose';

const fieldSchema = new Schema({
  key: { type: String, required: true }, // identifier e.g., sku, name
  label: { type: String, required: true },
  type: { type: String, enum: ['small_text','large_text','image','dropdown'], required: true },
  required: { type: Boolean, default: false },
  options: [String] // for dropdown
});

const templateSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  fields: [fieldSchema],
  createdAt: { type: Date, default: Date.now }
});

export default model('ItemFormTemplate', templateSchema);
