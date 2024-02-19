import { Point, TWO_PI, lerp } from '../../utils/math';
import { RGBA } from '../../utils/p5';
import { DEFAULT_SAMPLES, spiralCoord } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';

interface BlockProps {
  startAngle: number;
  endAngle: number;
  color: RGBA;
  config: CalendarConfig;
  samplesPerRotation?: number;
}

export const drawBlock: P5Component<BlockProps> = (
  p5,
  { startAngle, endAngle, color, samplesPerRotation = DEFAULT_SAMPLES },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  p5.noStroke();
  p5.fill(...color);

  p5.beginShape();

  let coord: Point;
  // outer arc
  for (let theta = startAngle; theta >= endAngle; theta -= sampleRate) {
    coord = spiralCoord(theta);
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = spiralCoord(endAngle);
  p5.vertex(coord.x, coord.y);

  // inner arc
  for (let theta = endAngle; theta <= startAngle; theta += sampleRate) {
    coord = spiralCoord(theta - TWO_PI);

    const outerCoord = spiralCoord(theta);
    const shiftedInner = {
      x: lerp(coord.x, outerCoord.x, 0.25),
      y: lerp(coord.y, outerCoord.y, 0.25),
    };
    p5.vertex(shiftedInner.x, shiftedInner.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = spiralCoord(startAngle - TWO_PI);
  const outerCoord = spiralCoord(startAngle);
  const shiftedInner = {
    x: lerp(coord.x, outerCoord.x, 0.25),
    y: lerp(coord.y, outerCoord.y, 0.25),
  };
  p5.vertex(shiftedInner.x, shiftedInner.y);

  p5.endShape();
};
