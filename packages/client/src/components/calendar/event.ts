import { CalendarConfig } from '../../state/Calendar';
import { Event } from '../../types';
import { TWO_PI, dist, lerp } from '../../utils/math';
import { spiralCoord, timeToAngle } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { drawBlock } from './block';
import { maxMarkerWidth } from './markers/time';

const eventHorzOffset = maxMarkerWidth + 0.01;

interface EventProps {
  event: Event;
  config: CalendarConfig;
  samplesPerRotation?: number;
}

export const drawEvent: P5Component<EventProps> = (p5, { event, config }) => {
  const startAngle = timeToAngle(event.start, config);
  const endAngle = timeToAngle(event.end, config);

  const columns = { total: 1, num: 1 };
  drawBlock(p5, {
    startAngle,
    endAngle,
    color: [0, 100, 255, 180],
    crossSection: {
      start:
        eventHorzOffset +
        (1 - eventHorzOffset) * ((columns.num - 1) / columns.total),
      end:
        eventHorzOffset + (1 - eventHorzOffset) * (columns.num / columns.total),
    },
  });

  drawEventLabel(p5, { name: event.name, startAngle });
};

interface EventLabelProps {
  name: string;
  startAngle: number;
}

const drawEventLabel: P5Component<EventLabelProps> = (
  p5,
  { name, startAngle },
) => {
  const textAngle = startAngle - 0.06;

  const outerPoint = spiralCoord(textAngle);
  const innerPoint = spiralCoord(textAngle - TWO_PI);

  const textPadding = 0.04;
  const textCoords = {
    x: lerp(innerPoint.x, outerPoint.x, eventHorzOffset + textPadding),
    y: lerp(innerPoint.y, outerPoint.y, eventHorzOffset + textPadding),
  };

  p5.noStroke();
  p5.fill(255);
  p5.textSize(dist(innerPoint, outerPoint) / 9);
  p5.textAlign(p5.LEFT, p5.CENTER);

  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-textAngle);
  p5.text(name, 0, 0);
  p5.pop();
};
