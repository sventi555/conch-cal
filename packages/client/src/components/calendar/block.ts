import { Point, TWO_PI } from '../../utils/math';
import { RGBA } from '../../utils/p5';
import { spiralCoord } from '../../utils/spiral';
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
  { startAngle, endAngle, color, samplesPerRotation = 360 },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  p5.noStroke();
  p5.fill(...color);

  p5.beginShape();

  let coord: Point;
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
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = spiralCoord(startAngle - TWO_PI);
  p5.vertex(coord.x, coord.y);

  p5.endShape();
};
