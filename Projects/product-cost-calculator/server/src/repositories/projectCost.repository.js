import { pool } from "../config/db.js";
import { randomUUID } from "crypto";
import { applyPagination } from "../utils/applyPagination.js";

export const ProjectCostRepository = {
  async createProject({
    project_name,
    total_cost,
    profit_value,
    profit_type,
    project_gst,
    product_type,
    production_quantity,
    project_progress,
  }) {
    const sql = `
      INSERT INTO cost_projects (
        project_uuid, project_name, total_cost, 
        profit_value, profit_type, project_gst, 
        product_type, project_progress, production_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [res] = await pool.execute(sql, [
      randomUUID(),
      project_name,
      total_cost,
      profit_value,
      profit_type,
      project_gst,
      product_type,
      project_progress,
      production_quantity,
    ]);
    return this.findProjectById(res.insertId);
  },

  async addProjectItems(project_id, items) {
    const sql = `
      INSERT INTO cost_project_items 
      (project_id, resource_type, resource_id, resource_name, data)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      await pool.execute(sql, [
        project_id,
        item.resource_type,
        item.data.resource_id,
        item.data.resource_name || null,
        JSON.stringify(item.data),
      ]);
    }
  },

  async findProjectById(id) {
    const [rows] = await pool.execute(
      `
      SELECT * FROM cost_projects WHERE id = ? AND is_active = 1
    `,
      [id]
    );

    return rows[0] || null;
  },

  async findProjectWithItems(id) {
    const [projectRows] = await pool.execute(
      `
      SELECT * FROM cost_projects WHERE id = ? AND is_active = 1
    `,
      [id]
    );

    if (projectRows.length === 0) return null;

    const [itemsRows] = await pool.execute(
      `
      SELECT id, resource_type, resource_id, resource_name, data
      FROM cost_project_items
      WHERE project_id = ?
      ORDER BY id ASC
    `,
      [id]
    );

    return {
      ...projectRows[0],
      items: itemsRows.map((i) => ({
        data: i.data,
        resource_type: i.resource_type,
      })),
    };
  },

  async findAllProjects(filters = {}) {
    let sql = `
    SELECT *
    FROM cost_projects
    WHERE 1=1
  `;
    const params = [];

    sql += ` AND is_active = 1`;

    // Filtering by project name
    if (filters.project_name) {
      sql += ` AND project_name LIKE ?`;
      params.push(`%${filters.project_name}%`);
    }

    // Sorting
    sql += ` ORDER BY created_at DESC`;
    sql = applyPagination(sql, filters);

    const [rows] = await pool.execute(sql, params);

    const finalRow = rows.map((r) => ({
      ...r,
      total_cost: r.total_cost?.invoice?.totals?.grand_total,
    }));

    return finalRow;
  },

  async deleteProject(id) {
    await pool.execute(`UPDATE cost_projects SET is_active = 0 WHERE id = ?`, [
      id,
    ]);
    return { success: true };
  },

  async updateImage(project_id, image_url) {
    const sql = `
    UPDATE cost_projects 
    SET image_url = ?
    WHERE id = ? AND is_active = 1
  `;
    const [res] = await pool.execute(sql, [image_url, project_id]);
    return res;
  },
};
