import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { pool } from "./src/config/db.js";

dotenv.config();

async function runMigrations() {
  const client = await pool.connect();

  console.log("Connected to PostgreSQL database");

  try {
    // 1. (Optional) Reset schema instead of dropping database
    console.log("Dropping public schema and recreating it...");

    await client.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
    await client.query(`CREATE SCHEMA public;`);

    // 2. Read SQL files
    const modelsDir = path.resolve("src/models");
    const sqlFiles = fs
      .readdirSync(modelsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`Found ${sqlFiles.length} SQL files to execute:`);

    // 3. Execute each SQL file
    for (const file of sqlFiles) {
      const filePath = path.join(modelsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Executing: ${file}`);

      try {
        await client.query(sql);
        console.log(`Executed: ${file}`);
      } catch (err) {
        console.error(`Error in ${file}:`, err.message);
        process.exit(1);
      }
    }

    console.log("Migration completed successfully!");
  } finally {
    client.release();
  }

  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
