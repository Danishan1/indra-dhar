import { db } from "../config/db.js";

export const DashboardRepository = {
  async summary(tenantId) {
    const result = await db.query(
      `
SELECT

(
 SELECT COUNT(*)
 FROM users
 WHERE tenant_id=$1
) AS total_users,


(
 SELECT COUNT(*)
 FROM users
 WHERE tenant_id=$1
 AND is_active=true
) AS active_users,


(
 SELECT COUNT(*)
 FROM teams
 WHERE tenant_id=$1
) AS total_teams,


(
 SELECT COUNT(*)
 FROM leads
 WHERE tenant_id=$1
) AS total_leads,


(
 SELECT COUNT(*)
 FROM leads
 WHERE tenant_id=$1
 AND stage NOT IN ('SUCCESS','FAILURE')
) AS open_leads,


(
 SELECT COUNT(*)
 FROM leads
 WHERE tenant_id=$1
 AND stage='SUCCESS'
) AS closed_leads


`,
      [tenantId],
    );

    return result.rows[0];
  },

  async teamHierarchy(tenantId) {
    const result = await db.query(
      `
WITH RECURSIVE team_tree AS (

    SELECT

    t.id,
    t.parent_team_id,
    t.name,

    0 AS level


    FROM teams t

    WHERE t.tenant_id=$1

    AND t.parent_team_id IS NULL



    UNION ALL



    SELECT

    child.id,
    child.parent_team_id,
    child.name,

    parent.level+1


    FROM teams child


    INNER JOIN team_tree parent

    ON child.parent_team_id = parent.id

)


SELECT

t.id,
t.name,
t.parent_team_id,


(
 SELECT COUNT(*)
 FROM team_members tm
 WHERE tm.team_id=t.id
) members,


(
 SELECT COUNT(*)
 FROM leads l
 WHERE l.team_id=t.id
) leads,


(
 SELECT COUNT(*)
 FROM leads l
 WHERE l.team_id=t.id
 AND l.stage='SUCCESS'
) converted,


(
 SELECT COUNT(*)
 FROM tasks tk
 WHERE tk.team_id=t.id
 AND tk.status='PENDING'
) pending_tasks


FROM team_tree t


ORDER BY level,name

`,
      [tenantId],
    );

    return buildTree(result.rows);
  },
};

function buildTree(rows) {
  const map = {};

  rows.forEach((item) => {
    map[item.id] = {
      ...item,
      children: [],
    };
  });

  const roots = [];

  rows.forEach((item) => {
    if (item.parent_team_id) {
      map[item.parent_team_id]?.children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}
