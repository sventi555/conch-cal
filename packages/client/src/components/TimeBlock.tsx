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

export const TimeBlock = ({
  start,
  end,
  focusedTime,
  rotationsToFocus,
  rotationsPerDay,
  a,
  k,
  samplesPerRotation = 360,
}: TimeBlockProps) => {
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

  const coords: Point[] = [];
  // outer arc
  for (let theta = startAngle; theta >= endAngle; theta -= sampleRate) {
    coords.push(polarToCart(spiralRadius(theta, a, k), theta));
  }
  // make sure we hit the very edge (hide sampling errors)
  coords.push(polarToCart(spiralRadius(endAngle, a, k), endAngle));

  // inner arc
  for (let theta = endAngle; theta <= startAngle; theta += sampleRate) {
    coords.push(polarToCart(spiralRadius(theta - TWO_PI, a, k), theta));
  }
  // make sure we hit the very edge (hide sampling errors)
  coords.push(polarToCart(spiralRadius(startAngle - TWO_PI, a, k), startAngle));

  const coordString =
    `M ${coords[0].x} ${coords[0].y}` +
    coords.slice(1).map((coord) => ` L ${coord.x} ${coord.y}`) +
    ' Z';

  return (
    <g fill="blue">
      <path d={coordString} />
    </g>
  );
};
