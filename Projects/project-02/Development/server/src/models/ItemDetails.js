import mongoose, { Schema, model } from "mongoose";

const itemDetailsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    items: {
      type: Number, // Assuming this should be a numeric value since it's "No. of Items"
      required: true,
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt fields
  }
);

export const ItemDetails =
  mongoose.models.ItemDetails || model("ItemDetails", itemDetailsSchema);
