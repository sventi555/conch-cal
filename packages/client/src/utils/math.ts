export const TWO_PI = 2 * Math.PI;

export interface Point {
  x: number;
  y: number;
}

export const radToDeg = (theta: number) => {
  return (theta / TWO_PI) * 360;
};

export const polarToCart = (r: number, theta: number): Point => {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
};

export const lerp = (a: number, b: number, alpha: number) => {
  return a + alpha * (b - a);
};

export const dist = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
};
