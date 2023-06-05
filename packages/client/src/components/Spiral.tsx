import { Point, TWO_PI, polarToCart } from '../utils/math';
import { spiralRadius } from '../utils/spiral';

interface SpiralProps {
  rotations: number;
  a: number;
  k: number;
  samplesPerRotation?: number;
}

export const Spiral = ({
  rotations,
  a,
  k,
  samplesPerRotation = 360,
}: SpiralProps) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  const coords: Point[] = [];
  for (let theta = 0; theta <= TWO_PI * rotations; theta += sampleRate) {
    coords.push(polarToCart(spiralRadius(theta, a, k), theta));
  }

  const coordString =
    `M ${coords[0].x} ${coords[0].y}` +
    coords.slice(1).map((coord) => ` L ${coord.x} ${coord.y}`);

  return (
    <g fill="none" stroke="black">
      <path d={coordString} />
    </g>
  );
};
