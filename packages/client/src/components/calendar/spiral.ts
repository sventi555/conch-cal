import { TWO_PI } from '../../utils/math';
import { DEFAULT_SAMPLES, spiralCoord } from '../../utils/spiral';
import { P5Component } from '../p5-component';

interface SpiralProps {
  stopAngle: number;
  samplesPerRotation?: number;
}

export const drawSpiral: P5Component<SpiralProps> = (
  p5,
  { stopAngle, samplesPerRotation = DEFAULT_SAMPLES },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  p5.stroke(0);
  p5.noFill();

  p5.beginShape();
  for (let theta = -TWO_PI; theta <= stopAngle; theta += sampleRate) {
    const coord = spiralCoord(theta);
    p5.vertex(coord.x, coord.y);
  }
  p5.endShape();
};
