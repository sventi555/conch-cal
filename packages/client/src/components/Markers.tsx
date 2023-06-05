import {
  MS_PER_HOUR,
  Point,
  TWO_PI,
  polarToCart,
  spiralRad,
  timeToAngle,
} from '../spiral-utils';

interface MarkersProps {
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

export const Markers = ({
  focusedTime,
  rotationsToFocus,
  rotationsPerDay,
  a,
  k,
}: MarkersProps) => {
  const hrAngle = (TWO_PI * rotationsPerDay) / 24;
  const lastHour = focusedTime - (focusedTime % MS_PER_HOUR);
  const lastHourAngle = timeToAngle(
    lastHour,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );

  const coords: { outer: Point; inner: Point }[] = [];
  for (let theta = lastHourAngle; theta >= TWO_PI; theta -= hrAngle) {
    const outerPoint = polarToCart(spiralRad(theta, a, k), theta);
    const innerPoint = polarToCart(spiralRad(theta - TWO_PI, a, k), theta);

    coords.push({ outer: outerPoint, inner: innerPoint });
  }

  return (
    <g>
      {coords.map(({ outer, inner }, index) => (
        <path
          key={index}
          fill="none"
          stroke="black"
          d={`M ${outer.x} ${outer.y} L ${inner.x} ${inner.y}`}
        />
      ))}
    </g>
  );
};

interface FocusMarkerProps {
  rotationsToFocus: number;
  a: number;
  k: number;
}

export const FocusMarker = ({ rotationsToFocus, a, k }: FocusMarkerProps) => {
  const focusOuterPoint = polarToCart(
    spiralRad(rotationsToFocus * TWO_PI + TWO_PI, a, k),
    0,
  );

  return (
    <g>
      <path
        fill="none"
        stroke="red"
        d={`M 0 0 L ${focusOuterPoint.x} ${focusOuterPoint.y}`}
      />
    </g>
  );
};
