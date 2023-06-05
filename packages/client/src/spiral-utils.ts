export const TWO_PI = 2 * Math.PI;

export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export interface Point {
  x: number;
  y: number;
}

export const spiralRad = (theta: number, a: number, k: number) => {
  return a * Math.pow(Math.E, k * theta);
};

export const polarToCart = (r: number, theta: number): Point => {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
};

export const timeToAngle = (
  time: number,
  focusedTime: number,
  rotationsToFocus: number,
  rotationsPerDay: number,
) => {
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return rotationsToFocus * TWO_PI - offsetFromFocus;
};
