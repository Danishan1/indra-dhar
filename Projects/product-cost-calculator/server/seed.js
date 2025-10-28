import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { pool } from "./src/config/db.js";

async function seed() {
  const connection = await pool.getConnection();

  console.log("Connected to database for seeding...");

  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "Password@123",
      role: "admin",
    },
    {
      name: "Project Manager",
      email: "manager@example.com",
      password: "Password@123",
      role: "manager",
    },
    {
      name: "Regular User",
      email: "user@example.com",
      password: "Password@123",
      role: "user",
    },
  ];

  for (const user of users) {
    const user_uuid = randomUUID();
    const password_hash = await bcrypt.hash(user.password, 10);

    const query = `
      INSERT INTO users (user_uuid, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      await connection.execute(query, [
        user_uuid,
        user.name,
        user.email,
        password_hash,
        user.role,
      ]);
      console.log(`Inserted ${user.role}: ${user.email}`);
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log(`Skipped (already exists): ${user.email}`);
      } else {
        console.error(`Error inserting ${user.email}:`, err.message);
      }
    }
  }

  console.log("Seeding completed!");
  connection.release();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
