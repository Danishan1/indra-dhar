import fs from "fs";
import path from "path";
// import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { pool } from "./src/config/db.js";
dotenv.config();

const { DB_NAME } = process.env;

async function runMigrations() {
  const connection = await pool.getConnection();

  console.log("Connected to MySQL server");

  // 1 Drop existing database
  console.log(`Dropping database '${DB_NAME}' if exists...`);
  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);

  // 2 Create new database
  console.log(`Creating new database '${DB_NAME}'...`);
  await connection.query(`CREATE DATABASE \`${DB_NAME}\`;`);
  await connection.query(`USE \`${DB_NAME}\`;`);

  // 3 Read and execute all SQL files in models/
  const modelsDir = path.resolve("src/models");
  const sqlFiles = fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort(); // Ensures consistent order

  console.log(`Found ${sqlFiles.length} SQL files to execute:`);

  for (const file of sqlFiles) {
    const filePath = path.join(modelsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");
    console.log(`Executing: ${file}`);

    try {
      await connection.query(sql);
      console.log(`Executed: ${file}`);
    } catch (err) {
      console.error(`Error in ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log("Migration completed successfully!");
  connection.release();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
