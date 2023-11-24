import { MS_PER_DAY, MS_PER_HOUR } from '../../utils/date';
import { TWO_PI, dist, lerp, polarToCart } from '../../utils/math';
import { spiralCoord, spiralRadius, timeToAngle } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';

interface MarkersProps {
  config: CalendarConfig;
  a: number;
  k: number;
}

export const drawMarkers: P5Component<MarkersProps> = (
  p5,
  { config, a, k },
) => {
  const { focusedTime, rotationsToFocus, rotationsPerDay } = config;
  const lastHour = focusedTime - (focusedTime % MS_PER_HOUR);
  const centerTime =
    focusedTime + (rotationsToFocus / rotationsPerDay) * MS_PER_DAY;

  // tack on a couple days worth of markers before the focus time.
  // adjust based on the canvas size and the size of the spiral
  const numPaddingRotations = 2;
  const hoursBeforeFocus = (numPaddingRotations * 24) / rotationsPerDay;

  const markerTimes: number[] = [];
  for (
    let time = lastHour - hoursBeforeFocus * MS_PER_HOUR;
    time < centerTime;
    time += MS_PER_HOUR
  ) {
    markerTimes.push(time);
  }

  markerTimes.forEach((time) => {
    drawMarkerLine(p5, { time, config, a, k });
    drawMarkerTime(p5, { time, config, a, k });
  });
};

const markerCoords = (
  time: number,
  config: CalendarConfig,
  a: number,
  k: number,
) => {
  const theta = timeToAngle(time, config);

  const outer = spiralCoord(theta, a, k);
  const inner = spiralCoord(theta - TWO_PI, a, k);

  return { inner, outer, theta };
};

interface MarkerLineProps {
  time: number;
  config: CalendarConfig;
  a: number;
  k: number;
}

const drawMarkerLine: P5Component<MarkerLineProps> = (
  p5,
  { time, config, a, k },
) => {
  const { inner, outer } = markerCoords(time, config, a, k);

  p5.stroke(0);
  p5.fill(0);

  // marker line
  p5.line(outer.x, outer.y, inner.x, inner.y);
};

interface MarkerTimeProps {
  time: number;
  config: CalendarConfig;
  a: number;
  k: number;
}

const drawMarkerTime: P5Component<MarkerTimeProps> = (
  p5,
  { time, config, a, k },
) => {
  const { inner, outer, theta } = markerCoords(time, config, a, k);

  const textCoords = {
    x: lerp(inner.x, outer.x, 0.02),
    y: lerp(inner.y, outer.y, 0.02),
  };

  p5.noStroke();
  p5.textSize(dist(inner, outer) / 8);

  // hour text
  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(0, -2);
  p5.text(`${new Date(time).getHours() % 12}:00`, 0, 0);
  p5.pop();
};

interface FocusMarkerProps {
  rotationsToFocus: number;
  a: number;
  k: number;
}

export const drawFocusMarker: P5Component<FocusMarkerProps> = (
  p5,
  { rotationsToFocus, a, k },
) => {
  const focusOuterPoint = polarToCart(
    spiralRadius(rotationsToFocus * TWO_PI + TWO_PI, a, k),
    0,
  );

  p5.stroke(255, 0, 0);
  p5.line(0, 0, focusOuterPoint.x, focusOuterPoint.y);
};
