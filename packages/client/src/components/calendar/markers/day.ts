import { DAYS, MS_PER_DAY } from '../../../utils/date';
import { dist } from '../../../utils/math';
import { RGBA } from '../../../utils/p5';
import { timeToAngle } from '../../../utils/spiral';
import { P5Component } from '../../p5-component';
import { CalendarConfig } from '../Calendar';
import { drawBlock } from '../block';
import { lineMarkerCoords } from './utils';

const blockColour = (time: number): RGBA => {
  const daysSinceEpoch = Math.floor(time / MS_PER_DAY);
  const light = 255 - 20 * (daysSinceEpoch % 2);

  return [light, light, light];
};

interface DayBlockProps {
  time: number;
  config: CalendarConfig;
}

/**
 * `time` should be midnight on some day
 */
export const drawDayBlock: P5Component<DayBlockProps> = (
  p5,
  { time, config },
) => {
  drawBlock(p5, {
    startAngle: timeToAngle(time, config),
    endAngle: timeToAngle(time + MS_PER_DAY, config),
    color: blockColour(time),
    config,
  });
};

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
  const { inner, outer, theta } = lineMarkerCoords(time, config);

  const text = DAYS[new Date(time).getDay()];

  const lineLen = dist(inner, outer);

  p5.textSize(lineLen / 7);
  const textWidth = p5.textWidth(text);
  const textHeight = p5.textAscent();
  const textDistFromInner = lineLen * 0.55;
  const textPadding = textWidth * 0.15;

  p5.noStroke();
  p5.fill(...blockColour(time));

  const tabRadii = [2, 2, 0, 0];
  p5.push();
  p5.translate(inner.x, inner.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(textDistFromInner - textPadding, -textHeight - textPadding);
  p5.rect(
    0,
    0,
    textWidth + textPadding * 2,
    textHeight + textPadding + 1,
    ...tabRadii,
  );
  p5.pop();

  p5.noStroke();
  p5.fill(0);
  p5.textAlign(p5.LEFT, p5.BOTTOM);

  p5.push();
  p5.translate(inner.x, inner.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(textDistFromInner, 0);
  p5.text(text, 0, 0);
  p5.pop();
};
