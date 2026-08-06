export const remainPercent = (deadline: Date | null, createdAt: Date | null): number => {
  if (!deadline || !createdAt) return 0;

  const total = deadline.getTime() - createdAt.getTime();
  const elapsed = Date.now() - createdAt.getTime();

  if (total <= 0) return 0;
  const percent = (elapsed / total) * 100;

  return Math.min(100, Math.max(0, percent));
};