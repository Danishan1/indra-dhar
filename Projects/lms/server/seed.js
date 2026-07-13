import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { pool } from "./src/config/db.js";

async function seed() {
  const client = await pool.connect();

  console.log("Connected to PostgreSQL for seeding...");

  try {
    // =====================================================
    // TENANT
    // =====================================================

    let tenantId;

    const tenant = await client.query(
      `
      INSERT INTO tenants (id, name, code, status)
      VALUES ($1,$2,$3,'ACTIVE')
      ON CONFLICT (code)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
      `,
      [randomUUID(), "Default Tenant", "DEFAULT"],
    );

    tenantId = tenant.rows[0].id;

    console.log("Tenant seeded");

    // =====================================================
    // USERS
    // =====================================================

    const users = [
      {
        first_name: "Admin",
        last_name: "User",
        email: "admin@example.com",
        password: "Password@123",
      },
      {
        first_name: "Project",
        last_name: "Manager",
        email: "manager@example.com",
        password: "Password@123",
      },
      {
        first_name: "Regular",
        last_name: "User",
        email: "user@example.com",
        password: "Password@123",
      },
    ];

    const userIds = {};

    for (const user of users) {
      const hash = await bcrypt.hash(user.password, 10);

      await client.query(
        `
        INSERT INTO users (
            id,
            tenant_id,
            first_name,
            last_name,
            email,
            password_hash
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT (tenant_id,email)
        DO NOTHING
        `,
        [
          randomUUID(),
          tenantId,
          user.first_name,
          user.last_name,
          user.email,
          hash,
        ],
      );

      const existing = await client.query(
        `
        SELECT id
        FROM users
        WHERE tenant_id = $1
          AND email = $2
        `,
        [tenantId, user.email],
      );

      userIds[user.email] = existing.rows[0].id;

      console.log(`${user.email}`);
    }

    // =====================================================
    // TEAM
    // =====================================================

    const team = await client.query(
      `
      INSERT INTO teams (
          id,
          tenant_id,
          name
      )
      VALUES ($1,$2,$3)
      ON CONFLICT (tenant_id,name)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id
      `,
      [randomUUID(), tenantId, "Core Team"],
    );

    const teamId = team.rows[0].id;

    console.log("Team seeded");

    // =====================================================
    // TEAM MEMBERS
    // =====================================================

    const memberships = [
      {
        user: "admin@example.com",
        leader: true,
      },
      {
        user: "manager@example.com",
        leader: false,
      },
      {
        user: "user@example.com",
        leader: false,
      },
    ];

    for (const member of memberships) {
      await client.query(
        `
        INSERT INTO team_members (
            team_id,
            user_id,
            is_leader
        )
        VALUES ($1,$2,$3)
        ON CONFLICT (team_id,user_id)
        DO UPDATE
        SET is_leader = EXCLUDED.is_leader
        `,
        [teamId, userIds[member.user], member.leader],
      );
    }

    console.log("Team members seeded");
    console.log("Seeding completed successfully!");
  } finally {
    client.release();
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
