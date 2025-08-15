import multer, { diskStorage } from "multer";
import { join, extname } from "path";
import { existsSync, mkdirSync, unlinkSync, renameSync } from "fs";
import sharp from "sharp";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const MAX_IMAGE_BYTES = parseInt(
  process.env.MAX_IMAGE_SIZE_BYTES || "5242880",
  10
);
const ALLOWED = [".png", ".jpg", ".jpeg", ".webp"];

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

// storage strategy: use diskStorage and filename unique by timestamp
const storage = diskStorage({
  destination: (req, file, cb) => {
    const { tenantId, itemId } = req.params; // expecting route to pass these
    const dest = join(process.cwd(), UPLOAD_DIR, tenantId, "items", itemId);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, ALLOWED.includes(ext));
  },
});

async function processImage(filePath) {
  // e.g., create a webp small variant and overwrite original or store separate
  const tmpPath = filePath + ".webp";
  await sharp(filePath)
    .resize(1600, 1600, { fit: "inside" })
    .webp({ quality: 80 })
    .toFile(tmpPath);
  // replace original with processed
  unlinkSync(filePath);
  renameSync(tmpPath, filePath);
}

export { upload, processImage, UPLOAD_DIR };
