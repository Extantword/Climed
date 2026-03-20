export function calculateRiskScore({ precipitation = 0, riverDischarge = {}, aqi = 0, comunaRiskLevel = 'bajo' }) {
  let score = 0;

  if (precipitation > 30) score += 30;
  else if (precipitation > 15) score += 20;
  else if (precipitation > 5) score += 10;

  const current = riverDischarge.current || 0;
  const mean = riverDischarge.mean || 1;
  const ratio = current / mean;
  if (ratio > 3) score += 30;
  else if (ratio > 2) score += 20;
  else if (ratio > 1.5) score += 10;

  if (comunaRiskLevel === 'alto') score += 20;
  else if (comunaRiskLevel === 'medio') score += 10;

  if (aqi > 150) score += 20;
  else if (aqi > 100) score += 10;
  else if (aqi > 50) score += 5;

  let level;
  if (score >= 70) level = 'rojo';
  else if (score >= 45) level = 'naranja';
  else if (score >= 25) level = 'amarillo';
  else level = 'verde';

  return { score, level };
}

export function shouldShowAlert({ precipitation6h = 0, riverDischarge = {} }) {
  const current = riverDischarge.current || 0;
  const threshold = riverDischarge.alertThreshold || 300;
  return precipitation6h > 20 || current > threshold;
}
