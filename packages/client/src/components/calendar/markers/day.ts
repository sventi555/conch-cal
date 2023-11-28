import { MS_PER_DAY } from '../../../utils/date';
import { timeToAngle } from '../../../utils/spiral';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { drawBlock } from '../block';

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
  const daysSinceEpoch = Math.floor(time / MS_PER_DAY);
  const light = 255 - 20 * (daysSinceEpoch % 2);
  drawBlock(p5, {
    startAngle: timeToAngle(time, config),
    endAngle: timeToAngle(time + MS_PER_DAY, config),
    color: [light, light, light],
    config,
  });
};
