export function calculateWorkHours(amount: number | null, hourlyWage: number): number | null {
  if (amount === null || !Number.isFinite(amount)) return null
  if (!Number.isFinite(hourlyWage) || hourlyWage <= 0) return null
  return Math.round((amount / hourlyWage) * 10) / 10
}
