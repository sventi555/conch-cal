import { Event } from 'lib';
import { Point, TWO_PI, dist, lerp } from '../../utils/math';
import { spiralCoord, timeToAngle } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';

interface EventProps {
  event: Event;
  config: CalendarConfig;
  samplesPerRotation?: number;
}

export const drawEvent: P5Component<EventProps> = (
  p5,
  { event, config, samplesPerRotation = 360 },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  const startAngle = timeToAngle(event.start, config);
  const endAngle = timeToAngle(event.end, config);

  p5.noStroke();
  p5.fill(0, 0, 255);

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

  drawEventLabel(p5, { name: event.name, startAngle });
};

interface EventLabelProps {
  name: string;
  startAngle: number;
}

const drawEventLabel: P5Component<EventLabelProps> = (
  p5,
  { name, startAngle },
) => {
  const textAngle = startAngle - 0.08;

  const outerPoint = spiralCoord(textAngle);
  const innerPoint = spiralCoord(textAngle - TWO_PI);

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
