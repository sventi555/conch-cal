import { MS_PER_DAY, MS_PER_HOUR } from '../utils/date';
import { TWO_PI, dist, lerp, polarToCart, radToDeg } from '../utils/math';
import { spiralRadius, timeToAngle } from '../utils/spiral';

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
  const lastHour = focusedTime - (focusedTime % MS_PER_HOUR);
  const centerTime =
    focusedTime + (rotationsToFocus / rotationsPerDay) * MS_PER_DAY;

  const markerTimes: number[] = [];
  for (let time = lastHour; time < centerTime; time += MS_PER_HOUR) {
    markerTimes.push(time);
  }

  return (
    <g>
      {markerTimes.map((time) => (
        <Marker
          key={time}
          time={time}
          focusedTime={focusedTime}
          rotationsToFocus={rotationsToFocus}
          rotationsPerDay={rotationsPerDay}
          a={a}
          k={k}
        />
      ))}
    </g>
  );
};

interface MarkerProps {
  time: number;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

const Marker = ({
  time,
  focusedTime,
  rotationsToFocus,
  rotationsPerDay,
  a,
  k,
}: MarkerProps) => {
  const theta = timeToAngle(
    time,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );

  const outerPoint = polarToCart(spiralRadius(theta, a, k), theta);
  const innerPoint = polarToCart(spiralRadius(theta - TWO_PI, a, k), theta);

  const textCoords = {
    x: lerp(innerPoint.x, outerPoint.x, 0.1),
    y: lerp(innerPoint.y, outerPoint.y, 0.1),
  };

  return (
    <>
      <path
        fill="none"
        stroke="black"
        d={`M ${outerPoint.x} ${outerPoint.y} L ${innerPoint.x} ${innerPoint.y}`}
      />
      <text
        fontSize={(12 * dist(innerPoint, outerPoint)) / 80}
        transform={`translate(${textCoords.x}, ${
          textCoords.y
        }) rotate(${radToDeg(theta)}) scale(1, -1)`}
      >
        {new Date(time).getHours()}
      </text>
    </>
  );
};

interface FocusMarkerProps {
  rotationsToFocus: number;
  a: number;
  k: number;
}

export const FocusMarker = ({ rotationsToFocus, a, k }: FocusMarkerProps) => {
  const focusOuterPoint = polarToCart(
    spiralRadius(rotationsToFocus * TWO_PI + TWO_PI, a, k),
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
