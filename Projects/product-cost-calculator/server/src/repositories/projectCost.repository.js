import { pool } from "../config/db.js";
import { randomUUID } from "crypto";

export const ProjectCostRepository = {
  async createProject({ project_name, total_cost }) {
    const sql = `
      INSERT INTO cost_projects (project_uuid, project_name, total_cost)
      VALUES (?, ?, ?)
    `;

    const [res] = await pool.execute(sql, [
      randomUUID(),
      project_name,
      total_cost,
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
      SELECT * FROM cost_projects WHERE id = ?
    `,
      [id]
    );

    return rows[0] || null;
  },

  async findProjectWithItems(id) {
    const [projectRows] = await pool.execute(
      `
      SELECT * FROM cost_projects WHERE id = ?
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
      items: itemsRows.map((i) => ({ ...i, data: JSON.parse(i.data) })),
    };
  },

  async findAllProjects() {
    const [rows] = await pool.execute(`
      SELECT * FROM cost_projects 
      ORDER BY created_at DESC
    `);

    return rows;
  },
};
