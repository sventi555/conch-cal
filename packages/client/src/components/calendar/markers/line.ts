import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { lineMarkerCoords } from './utils';

interface LineMarkerProps {
  time: number;
  config: CalendarConfig;
}

export const drawLineMarker: P5Component<LineMarkerProps> = (
  p5,
  { time, config },
) => {
  const { inner, outer } = lineMarkerCoords(time, config);

  p5.stroke(0);
  p5.fill(0);

  p5.line(outer.x, outer.y, inner.x, inner.y);
};
