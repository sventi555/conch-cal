import { MS_PER_DAY, MS_PER_HOUR, isMidnight } from '../../utils/date';
import { TWO_PI, dist, lerp, polarToCart } from '../../utils/math';
import { spiralCoord, spiralRadius, timeToAngle } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';

const lineMarkerCoords = (time: number, config: CalendarConfig) => {
  const theta = timeToAngle(time, config);

  const outer = spiralCoord(theta);
  const inner = spiralCoord(theta - TWO_PI);

  return { inner, outer, theta };
};

interface LineMarkerProps {
  time: number;
  config: CalendarConfig;
}

const drawLineMarker: P5Component<LineMarkerProps> = (p5, { time, config }) => {
  const { inner, outer } = lineMarkerCoords(time, config);

  p5.stroke(0);
  p5.fill(0);

  p5.line(outer.x, outer.y, inner.x, inner.y);
};

interface TimeMarkerProps {
  time: number;
  config: CalendarConfig;
}

const drawTimeMarker: P5Component<TimeMarkerProps> = (p5, { time, config }) => {
  const { inner, outer, theta } = lineMarkerCoords(time, config);

  const textCoords = {
    x: lerp(inner.x, outer.x, 0.02),
    y: lerp(inner.y, outer.y, 0.02),
  };

  p5.noStroke();
  p5.fill(0, 160);
  p5.textSize(dist(inner, outer) / 8);

  const hour = new Date(time).getHours();
  const isAm = hour < 12;
  const displayText = `${hour % 12 === 0 ? 12 : hour % 12} ${
    isAm ? 'AM' : 'PM'
  }`;

  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(0, -2);
  p5.text(displayText, 0, 0);
  p5.pop();
};

interface DayMarkerProps {
  time: number;
  config: CalendarConfig;
}

/**
 * `time` should be midnight on some day
 */
const drawDayMarker: P5Component<DayMarkerProps> = (p5, { time, config }) => {
  const { inner, outer, theta } = lineMarkerCoords(
    time - (25 / 60) * MS_PER_HOUR,
    config,
  );

  const textCoords = {
    x: lerp(inner.x, outer.x, 0.02),
    y: lerp(inner.y, outer.y, 0.02),
  };

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  p5.noStroke();
  p5.fill(255, 0, 0);
  p5.textSize(dist(inner, outer) / 8);

  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(0, -2);
  p5.text(days[new Date(time).getDay()], 0, 0);
  p5.pop();
};

interface MarkersProps {
  config: CalendarConfig;
}

export const drawMarkers: P5Component<MarkersProps> = (p5, { config }) => {
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
    drawLineMarker(p5, { time, config });
    drawTimeMarker(p5, { time, config });
    if (isMidnight(time)) {
      drawDayMarker(p5, { time, config });
    }
  });
};

interface FocusMarkerProps {
  rotationsToFocus: number;
}

export const drawFocusMarker: P5Component<FocusMarkerProps> = (
  p5,
  { rotationsToFocus },
) => {
  const focusOuterPoint = polarToCart(
    spiralRadius(rotationsToFocus * TWO_PI + TWO_PI),
    0,
  );

  p5.stroke(255, 0, 0);
  p5.line(0, 0, focusOuterPoint.x, focusOuterPoint.y);
};
