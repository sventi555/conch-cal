import p5Types from 'p5';
import { Point } from './math';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;

export const CANVAS_TRANS = {
  x: CANVAS_WIDTH / 2 - 40,
  y: CANVAS_HEIGHT / 2 - 40,
};

export const mouseInCanvas = (p5: p5Types) => {
  return (
    p5.mouseX >= 0 &&
    p5.mouseX < p5.width &&
    p5.mouseY >= 0 &&
    p5.mouseY < p5.height
  );
};

export const eventInCanvas = (event?: UIEvent): event is UIEvent => {
  const target = event?.target;
  const inCanvas =
    target && target instanceof Element && target.className === 'p5Canvas';

  return !!inCanvas;
};

export type RGBA = [number, number, number, number?];

export const canvasToCart = (p: Point) => {
  return { x: p.x - CANVAS_TRANS.x, y: -(p.y - CANVAS_TRANS.y) };
};

export const cartToCanvas = (p: Point) => {
  return { x: p.x + CANVAS_TRANS.x, y: -p.y + CANVAS_TRANS.y };
};
