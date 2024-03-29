import { CalendarConfig } from '../../../state/Calendar';
import { dist, lerp } from '../../../utils/math';
import { P5Component } from '../../p5-component';
import { lineMarkerCoords } from './utils';

const timeMarkerWidths = {
  quarter: 0.1,
  half: 0.15,
  hour: 0.25,
  day: 1,
};

// exclude day from this since we really just want to know where the usable
// space is for drawing events
export const maxMarkerWidth = timeMarkerWidths.hour;

interface QuarterHourMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawQuarterHourMarker: P5Component<QuarterHourMarkerProps> = (
  p5,
  { time, config },
) => {
  drawMarkerLine(p5, { lineFraction: timeMarkerWidths.quarter, time, config });
};

interface HalfHourMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawHalfHourMarker: P5Component<HalfHourMarkerProps> = (
  p5,
  { time, config },
) => {
  drawMarkerLine(p5, { lineFraction: timeMarkerWidths.half, time, config });
};

const getHourText = (time: number) => {
  const hour = new Date(time).getHours();
  const isAm = hour < 12;

  return { num: `${hour % 12 === 0 ? 12 : hour % 12}`, m: isAm ? 'AM' : 'PM' };
};

interface HourMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawHourMarker: P5Component<HourMarkerProps> = (
  p5,
  { time, config },
) => {
  const text = getHourText(time);
  drawMarkerLine(p5, { lineFraction: timeMarkerWidths.hour, time, config });
  drawMarkerText(p5, { text: text.num, subText: text.m, time, config });
};

const getDayText = (time: number) => {
  const day = new Date(time).toLocaleDateString(undefined, {
    weekday: 'short',
  });

  return day;
};

interface DayMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawDayMarker: P5Component<DayMarkerProps> = (
  p5,
  { time, config },
) => {
  const text = getDayText(time);
  drawMarkerLine(p5, { lineFraction: timeMarkerWidths.day, time, config });
  drawMarkerText(p5, { text, time, config });
};

interface MarkerTextProps {
  text: string;
  subText?: string;
  time: number;
  config: CalendarConfig;
}

const drawMarkerText: P5Component<MarkerTextProps> = (
  p5,
  { text, subText, time, config },
) => {
  const { inner, outer, theta } = lineMarkerCoords(time, config);
  const lineLen = dist(inner, outer);

  const textPadding = 0.02 * lineLen;

  p5.noStroke();
  p5.fill(0);
  p5.textSize(lineLen / 9);
  p5.textAlign(p5.LEFT, p5.BOTTOM);

  const textWidth = p5.textWidth(text);

  p5.push();
  p5.translate(inner.x, inner.y);
  p5.scale(1, -1);
  p5.rotate(-theta);

  p5.translate(textPadding, 0);
  p5.text(text, 0, 0);

  if (subText) {
    p5.textSize(lineLen / 16);
    p5.translate(textWidth + 1, -1);
    p5.text(subText, 0, 0);
  }

  p5.pop();
};

interface MarkerLineProps {
  lineFraction: number;
  time: number;
  config: CalendarConfig;
}

const drawMarkerLine: P5Component<MarkerLineProps> = (
  p5,
  { lineFraction, time, config },
) => {
  const { inner, outer } = lineMarkerCoords(time, config);

  const shiftedOuter = {
    x: lerp(inner.x, outer.x, lineFraction),
    y: lerp(inner.y, outer.y, lineFraction),
  };

  p5.strokeWeight(1);
  p5.stroke(240);
  p5.line(inner.x, inner.y, outer.x, outer.y);

  p5.stroke(0);
  p5.line(inner.x, inner.y, shiftedOuter.x, shiftedOuter.y);
};
