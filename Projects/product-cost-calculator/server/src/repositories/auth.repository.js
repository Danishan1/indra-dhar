import { pool } from "../config/db.js";
import { randomUUID } from "crypto";

export const createUser = async ({ name, email, password_hash, role }) => {
  const user_uuid = randomUUID();
  const [result] = await pool.query(
    `INSERT INTO users (user_uuid, name, email, password_hash, role)
     VALUES (?, ?, ?, ?, ?)`,
    [user_uuid, name, email, password_hash, role || "user"]
  );
  return { id: result.insertId, user_uuid, name, email, role };
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
};
