import { dist, lerp } from '../../../utils/math';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { lineMarkerCoords } from './utils';

interface HourMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawHourMarker: P5Component<HourMarkerProps> = (
  p5,
  { time, config },
) => {
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
