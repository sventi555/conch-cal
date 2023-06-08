import p5Types from 'p5';
import { Point, TWO_PI, dist, lerp } from '../utils/math';
import { spiralCoord, timeToAngle } from '../utils/spiral';
import { CalendarConfig } from './Calendar';

export interface CalendarEvent {
  start: number;
  end: number;
  name: string;
}

interface EventProps {
  event: CalendarEvent;
  config: CalendarConfig;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

export const drawEvent = (
  p5: p5Types,
  { event, config, a, k, samplesPerRotation = 360 }: EventProps,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  const startAngle = timeToAngle(event.start, config);
  const endAngle = timeToAngle(event.end, config);

  p5.noStroke();
  p5.fill(0, 0, 255);

  p5.beginShape();

  let coord: Point;
  for (let theta = startAngle; theta >= endAngle; theta -= sampleRate) {
    coord = spiralCoord(theta, a, k);
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = spiralCoord(endAngle, a, k);
  p5.vertex(coord.x, coord.y);

  // inner arc
  for (let theta = endAngle; theta <= startAngle; theta += sampleRate) {
    coord = spiralCoord(theta - TWO_PI, a, k);
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = spiralCoord(startAngle - TWO_PI, a, k);
  p5.vertex(coord.x, coord.y);

  p5.endShape();

  drawEventLabel(p5, { name: event.name, startAngle, a, k });
};

interface EventLabelProps {
  name: string;
  startAngle: number;
  a: number;
  k: number;
}

const drawEventLabel = (
  p5: p5Types,
  { name, startAngle, a, k }: EventLabelProps,
) => {
  const textAngle = startAngle - 0.08;

  const outerPoint = spiralCoord(textAngle, a, k);
  const innerPoint = spiralCoord(textAngle - TWO_PI, a, k);

  const textCoords = {
    x: lerp(innerPoint.x, outerPoint.x, 0.05),
    y: lerp(innerPoint.y, outerPoint.y, 0.05),
  };

  p5.noStroke();
  p5.fill(255);
  p5.textSize(dist(innerPoint, outerPoint) / 8);

  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-textAngle);
  p5.text(name, 0, 0);
  p5.pop();
};
