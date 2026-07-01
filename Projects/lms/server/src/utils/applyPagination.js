export function applyPagination(sql, filters) {
  if (filters.limit) sql += ` LIMIT ${Number(filters.limit)}`;
  else sql += ` LIMIT 20`;
  
  if (filters.offset) sql += ` OFFSET ${Number(filters.offset)}`;
  else sql += ` OFFSET 0`;

  return sql;
}
