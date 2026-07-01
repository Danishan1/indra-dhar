// const HOURS_PER_MONTH = 25 * 9;
const HOURS_PER_MONTH = 208;

export function normalizeOverheadValues(rawValue, frequency) {
  const value = Number(rawValue); // 👈 CRITICAL FIX

  let monthly = 0;
  let yearly = 0;
  let perHour = 0;

  switch (frequency) {
    case "Monthly":
      monthly = value;
      yearly = value * 12;
      perHour = value / HOURS_PER_MONTH;
      break;

    case "Yearly":
      yearly = value;
      monthly = value / 12;
      perHour = monthly / HOURS_PER_MONTH;
      break;

    case "Per Hour":
      perHour = value;
      monthly = value * HOURS_PER_MONTH;
      yearly = monthly * 12;
      break;
  }

  return {
    monthly_value: Number(monthly.toFixed(2)),
    yearly_value: Number(yearly.toFixed(2)),
    per_hour_value: Number(perHour.toFixed(2)),
  };
}
