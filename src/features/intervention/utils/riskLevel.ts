export type RiskLevel = 'low' | 'medium' | 'high'

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 1) return 'low'
  if (score <= 3) return 'medium'
  return 'high'
}
