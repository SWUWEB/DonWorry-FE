export type RiskLevel = 'low' | 'medium' | 'high'

export const MAX_RISK_SCORE = 5

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 1) return 'low'
  if (score <= 3) return 'medium'
  return 'high'
}

export function parseRiskScore(raw: string | null): number | null {
  if (raw === null || !/^\d+$/.test(raw)) return null

  const value = Number(raw)
  return value >= 0 && value <= MAX_RISK_SCORE ? value : null
}
