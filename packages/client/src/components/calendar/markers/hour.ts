import { dist, lerp } from '../../../utils/math';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { lineMarkerCoords } from './utils';

const getDisplayText = (time: number) => {
  const hour = new Date(time).getHours();
  const isAm = hour < 12;
  const displayText = `${hour % 12 === 0 ? 12 : hour % 12} ${
    isAm ? 'AM' : 'PM'
  }`;

  return displayText;
};

interface HourMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawHourMarker: P5Component<HourMarkerProps> = (
  p5,
  { time, config },
) => {
  const { inner, outer, theta } = lineMarkerCoords(time, config);

  const displayText = getDisplayText(time);

  const lineLen = dist(inner, outer);
  const textPadding = 0.02 * lineLen;

  p5.noStroke();
  p5.fill(0);
  p5.textSize(lineLen / 10);
  p5.textAlign(p5.LEFT, p5.CENTER);

  p5.push();
  p5.translate(inner.x, inner.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(textPadding, 0);
  p5.text(displayText, 0, 0);
  p5.pop();

  const textWidth = p5.textWidth(displayText);
  const lineStartOffset = textWidth + textPadding * 2;
  const shiftedInner = {
    x: lerp(inner.x, outer.x, lineStartOffset / lineLen),
    y: lerp(inner.y, outer.y, lineStartOffset / lineLen),
  };

  p5.stroke(0);

  p5.line(shiftedInner.x, shiftedInner.y, outer.x, outer.y);
};
