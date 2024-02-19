export const TWO_PI = 2 * Math.PI;

export interface Point {
  x: number;
  y: number;
}

export const canvasToCart = (
  p: Point,
  canvasXTrans: number,
  canvasYTrans: number,
) => {
  return { x: p.x - canvasXTrans, y: -(p.y - canvasYTrans) };
};

export const radToDeg = (theta: number) => {
  return (theta / TWO_PI) * 360;
};

export const polarToCart = (r: number, theta: number): Point => {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
};

export const cartToPolar = ({ x, y }: Point) => {
  const r = Math.hypot(x, y);
  let theta: number;
  if (x > 0 && y > 0) {
    // quadrant 1: do nothing
    theta = Math.atan(y / x);
  } else if (x < 0 && y > 0) {
    // quadrant 2: atan(y/x) + PI
    theta = Math.atan(y / x) + Math.PI;
  } else if (x < 0 && y < 0) {
    // quadrant 3: atan(y/x) + PI
    theta = Math.atan(y / x) + Math.PI;
  } else if (x > 0 && y < 0) {
    // quadrant 4: atan(y/x) + TWO PI
    theta = Math.atan(y / x) + TWO_PI;
  } else if (x === 0 && y > 0) {
    // positive side of y axis: 90 deg
    theta = Math.PI / 2;
  } else if (x === 0 && y < 0) {
    // negative side of y axis: 270 deg
    theta = (3 * Math.PI) / 2;
  } else {
    // origin: just return 0
    theta = 0;
  }

  return { r, theta };
};

export const lerp = (a: number, b: number, alpha: number) => {
  return a + alpha * (b - a);
};

export const dist = (a: Point, b: Point) => {
  return Math.hypot(b.x - a.x, b.y - a.y);
};

export const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max);
};
