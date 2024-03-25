import { CalendarConfig } from '../../../state/calendar';
import { MS_PER_15_MIN, MS_PER_DAY } from '../../../utils/date';
import { TWO_PI } from '../../../utils/math';
import { P5Component } from '../../p5-component';
import { drawBlock } from '../block';
import {
  drawDayMarker,
  drawHalfHourMarker,
  drawHourMarker,
  drawQuarterHourMarker,
} from './time';

interface MarkersProps {
  config: CalendarConfig;
}

export const drawMarkers: P5Component<MarkersProps> = (p5, { config }) => {
  const { focusedTime, angleToFocus, rotationsPerDay } = config;
  const lastTick = focusedTime - (focusedTime % MS_PER_15_MIN);
  const centerTime =
    focusedTime + (angleToFocus / TWO_PI / rotationsPerDay) * MS_PER_DAY;

  const markerTimes: number[] = [];
  for (let time = lastTick; time < centerTime; time += MS_PER_15_MIN) {
    markerTimes.push(time);
  }

  markerTimes.forEach((time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours === 0 && minutes === 0) {
      drawDayMarker(p5, { time, config });
    } else if (minutes === 0) {
      drawHourMarker(p5, { time, config });
    } else if (minutes % 30 === 0) {
      drawHalfHourMarker(p5, { time, config });
    } else if (rotationsPerDay > 1 && minutes % 15 === 0) {
      drawQuarterHourMarker(p5, { time, config });
    }
  });
};

interface OuterMaskProps {
  config: CalendarConfig;
}

export const drawOuterMask: P5Component<OuterMaskProps> = (p5, { config }) => {
  drawBlock(p5, {
    color: [255, 255, 255],
    startAngle: config.angleToFocus + 2 * TWO_PI,
    endAngle: config.angleToFocus,
  });
};
