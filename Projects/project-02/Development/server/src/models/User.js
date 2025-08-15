import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "admin",
      "kora",
      "paint",
      "finishing",
      "stock",
      "dispach-ecommerce",
      "dispach-bulk",
    ],
    required: true,
  },
  phases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phase" }],
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Password helper
userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
