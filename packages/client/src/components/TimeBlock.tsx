import p5Types from 'p5';
import { Point, TWO_PI, polarToCart } from '../utils/math';
import { spiralRadius, timeToAngle } from '../utils/spiral';

interface TimeBlockProps {
  start: number;
  end: number;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

export const drawTimeBlock = (
  p5: p5Types,
  {
    start,
    end,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
    a,
    k,
    samplesPerRotation = 360,
  }: TimeBlockProps,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  const startAngle = timeToAngle(
    start,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );
  const endAngle = timeToAngle(
    end,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );

  p5.fill(0, 0, 255);
  p5.beginShape();

  let coord: Point;
  for (let theta = startAngle; theta >= endAngle; theta -= sampleRate) {
    coord = polarToCart(spiralRadius(theta, a, k), theta);
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = polarToCart(spiralRadius(endAngle, a, k), endAngle);
  p5.vertex(coord.x, coord.y);

  // inner arc
  for (let theta = endAngle; theta <= startAngle; theta += sampleRate) {
    coord = polarToCart(spiralRadius(theta - TWO_PI, a, k), theta);
    p5.vertex(coord.x, coord.y);
  }
  // make sure we hit the very edge (hide sampling errors)
  coord = polarToCart(spiralRadius(startAngle - TWO_PI, a, k), startAngle);
  p5.vertex(coord.x, coord.y);

  p5.endShape();
};
