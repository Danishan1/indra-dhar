// middleware/upload.js
import multer from "multer";
import { extname } from "path";
import { supabase } from "../config/db.js";

// Multer in-memory storage (so file buffer is available for Supabase)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_IMAGE_SIZE_BYTES || "5242880") },
  fileFilter: (req, file, cb) => {
    const allowed = [".png", ".jpg", ".jpeg", ".webp"];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

export const uploadToSupabase = async (file) => {
  const fileExt = extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images") // your bucket name
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl;
};
