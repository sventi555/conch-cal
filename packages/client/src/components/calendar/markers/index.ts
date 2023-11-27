import { MS_PER_DAY, MS_PER_HOUR, isMidnight } from '../../../utils/date';
import { TWO_PI, polarToCart } from '../../../utils/math';
import { spiralRadius } from '../../../utils/spiral';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { drawDayMarker } from './day';
import { drawHourMarker } from './hour';

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
    if (isMidnight(time)) {
      drawDayMarker(p5, { time, config });
    }
    drawHourMarker(p5, { time, config });
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
