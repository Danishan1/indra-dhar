import { IndirectExpRepository } from "../../repositories/indirectExpense.repository.js";

export async function getTotalIndirectCost(filters = {}) {
  // Get all indirect expenses (already normalized)
  const expenses = await IndirectExpRepository.findAll(filters);

  // Sum up the monthly, yearly, and per-hour values
  const total = expenses.reduce(
    (acc, exp) => {
      acc.monthly += exp.monthly_value;
      acc.yearly += exp.yearly_value;
      acc.per_hour += exp.per_hour_value;
      return acc;
    },
    { monthly: 0, yearly: 0, per_hour: 0 },
  );

  // Round to 2 decimals for neatness
  const cost = {
    monthly_total: Number(total.monthly.toFixed(2)),
    yearly_total: Number(total.yearly.toFixed(2)),
    per_hour_total: Number(total.per_hour.toFixed(2)),
  };
  return cost.monthly_total;
}
