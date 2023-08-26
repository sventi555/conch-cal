import { TWO_PI } from '../utils/math';
import { spiralCoord } from '../utils/spiral';
import { P5Component } from './p5-component';

interface SpiralProps {
  rotations: number;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

export const drawSpiral: P5Component<SpiralProps> = (
  p5,
  { rotations, a, k, samplesPerRotation = 360 },
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
