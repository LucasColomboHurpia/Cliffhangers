export const START_POSITION_X = 0;
export const START_POSITION_Y = 0;
export const MAX_MOVES = 25;

export const stepXCoefficient: Record<number, { x: number, y: number }> = {
  1000: { x: 0.775, y: 0.212 },
  1200: { x: 0.885, y: 0.2415 },
  1300: { x: 0.940, y: 0.2565 },
  1400: { x: 0.995, y: 0.271 },
  1500: { x: 1.1, y: 0.30 },
  1600: { x: 1.14, y: 0.3115 },
  1700: { x: 1.23, y: 0.336 },
  1800: { x: 1.28, y: 0.349 },
  1900: { x: 1.38, y: 0.377 },
  2000: { x: 1.42, y: 0.3875 },
  2100: { x: 1.52, y: 0.4148 },
  2200: { x: 1.59, y: 0.4335 },
  2300: { x: 1.65, y: 0.45 },
  2400: { x: 1.70, y: 0.463 },
  2500: { x: 1.77, y: 0.482 },
  2600: { x: 1.81, y: 0.493 },
  2700: { x: 1.85, y: 0.505 },
  2800: { x: 1.92, y: 0.5235 },
  2900: { x: 1.99, y: 0.543 },
  3000: { x: 2.10, y: 0.573 },
  3100: { x: 2.14, y: 0.584 },
  3200: { x: 2.21, y: 0.602 },
  3300: { x: 2.29, y: 0.626 },
  3400: { x: 2.35, y: 0.641 },
  3500: { x: 2.41, y: 0.658 },
  3600: { x: 2.47, y: 0.675 },
}

export const getStepXCoefficient = (width: number): { x: number, y: number } => {
  const keys = Object.keys(stepXCoefficient).map(Number);
  const validKeys = keys.filter(key => key <= width);

  if (validKeys.length === 0) {
    return { x: 2, y: 0.94 };
  }

  const closestKey = Math.max(...validKeys);
  return stepXCoefficient[closestKey];
};