import p5Types from 'p5';
import { TWO_PI } from '../utils/math';
import { spiralCoord } from '../utils/spiral';

interface SpiralProps {
  rotations: number;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

export const drawSpiral = (
  p5: p5Types,
  { rotations, a, k, samplesPerRotation = 360 }: SpiralProps,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  p5.stroke(0);
  p5.noFill();

  p5.beginShape();
  for (let theta = 0; theta <= TWO_PI * rotations; theta += sampleRate) {
    const coord = spiralCoord(theta, a, k);
    p5.vertex(coord.x, coord.y);
  }
  p5.endShape();
};
