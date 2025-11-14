import { pool } from "../config/db.js";

export const CostCalculationRepository = {
  async findRawMaterialById(id) {
    const sql = `SELECT * FROM raw_materials WHERE id = ? AND is_active = 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findLaborById(id) {
    const sql = `SELECT * FROM labors WHERE id = ? AND is_active = 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findMachineById(id) {
    const sql = `SELECT * FROM machines WHERE id = ? AND is_active = 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findUtilityById(id) {
    const sql = `SELECT * FROM utilities WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findOverheadById(id) {
    const sql = `SELECT * FROM overheads WHERE id = ? AND is_active = 1`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },
};
