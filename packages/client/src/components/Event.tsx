import p5Types from 'p5';
import { Point, TWO_PI, dist, lerp } from '../utils/math';
import { spiralCoord, timeToAngle } from '../utils/spiral';

interface Event {
  start: number;
  end: number;
  name: string;
}

interface EventProps {
  event: Event;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

export const drawEvent = (p5: p5Types, props: EventProps) => {
  drawEventBlock(p5, props);
  drawEventLabel(p5, props);
};

interface EventBlockProps {
  event: Event;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

const drawEventBlock = (
  p5: p5Types,
  {
    event,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
    a,
    k,
    samplesPerRotation = 360,
  }: EventBlockProps,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  const startAngle = timeToAngle(
    event.start,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );
  const endAngle = timeToAngle(
    event.end,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );

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
};

interface EventLabelProps {
  event: Event;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

const drawEventLabel = (
  p5: p5Types,
  {
    event,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
    a,
    k,
  }: EventLabelProps,
) => {
  const startAngle = timeToAngle(
    event.start,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );
  const textAngle = startAngle - 0.08;

  const outerPoint = spiralCoord(textAngle, a, k);
  const innerPoint = spiralCoord(textAngle - TWO_PI, a, k);

  const d = dist(innerPoint, outerPoint);

  const textCoords = {
    x: lerp(innerPoint.x, outerPoint.x, 0.05),
    y: lerp(innerPoint.y, outerPoint.y, 0.05),
  };

  p5.fill(255);
  p5.textSize(d / 8);

  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-textAngle);
  p5.text(event.name, 0, 0);
  p5.pop();
};
