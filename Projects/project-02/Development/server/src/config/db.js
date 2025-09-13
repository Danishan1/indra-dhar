import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error", err);
    process.exit(1);
  }
}

// Use environment variables for security
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
