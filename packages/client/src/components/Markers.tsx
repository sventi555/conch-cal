import {
  MS_PER_DAY,
  MS_PER_HOUR,
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
  const lastHour = focusedTime - (focusedTime % MS_PER_HOUR);
  const centerTime =
    focusedTime - (rotationsToFocus / rotationsPerDay) * MS_PER_DAY;

  const markerTimes: number[] = [];
  for (let time = lastHour; time > centerTime; time -= MS_PER_HOUR) {
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

  const outerPoint = polarToCart(spiralRad(theta, a, k), theta);
  const innerPoint = polarToCart(spiralRad(theta - TWO_PI, a, k), theta);

  return (
    <path
      fill="none"
      stroke="black"
      d={`M ${outerPoint.x} ${outerPoint.y} L ${innerPoint.x} ${innerPoint.y}`}
    />
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
