// Simple sequential generator using a counters collection (atomic)
import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const counterSchema = new Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});

const Counter = models.Counter || model("Counter", counterSchema);

async function generateTrackingId(prefix = "", digits = 6) {
  const doc = await Counter.findByIdAndUpdate(
    prefix || "global",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const num = doc.seq;
  return String(num).padStart(digits, "0"); // e.g. 000123
}

export { generateTrackingId };
