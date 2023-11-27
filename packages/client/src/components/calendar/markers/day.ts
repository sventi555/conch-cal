import { MS_PER_DAY, MS_PER_HOUR } from '../../../utils/date';
import { dist, lerp } from '../../../utils/math';
import { timeToAngle } from '../../../utils/spiral';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { drawBlock } from '../block';
import { lineMarkerCoords } from './utils';

interface DayMarkerProps {
  time: number;
  config: CalendarConfig;
}

/**
 * `time` should be midnight on some day
 */
export const drawDayMarker: P5Component<DayMarkerProps> = (
  p5,
  { time, config },
) => {
  const { inner, outer, theta } = lineMarkerCoords(
    time - (25 / 60) * MS_PER_HOUR,
    config,
  );

  const daysSinceEpoch = Math.floor(time / MS_PER_DAY);
  const light = 255 - 20 * (daysSinceEpoch % 2);
  drawBlock(p5, {
    startAngle: theta,
    endAngle: timeToAngle(time + MS_PER_DAY, config),
    color: [light, light, light],
    config,
  });

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
