const single = (result) => {
  if (!result) return null;
  return result.rows?.[0] ?? null;
};

const many = (result) => {
  if (!result) return [];
  return result.rows ?? [];
};

const count = (result) => {
  return result.rowCount ?? 0;
};

export const dbResponse = {
  single,
  many,
  count,
};
