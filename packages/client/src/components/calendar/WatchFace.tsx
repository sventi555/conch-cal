import { TWO_PI } from '../../utils/math';
import { spiralCoord } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';
import { drawBlock } from './block';

interface WatchFaceProps {
  config: CalendarConfig;
}

export const drawWatchFaceBorder: P5Component<WatchFaceProps> = (
  p5,
  { config },
) => {
  const angle = config.angleToFocus;
  const outerCoord = spiralCoord(angle);

  // create a mask past the watch face to hide any protruding events or markers
  drawBlock(p5, {
    color: [255, 255, 255],
    config,
    startAngle: angle + 2 * TWO_PI,
    endAngle: angle + 0.09,
  });

  const width = 191.6;
  const height = 100;
  p5.stroke(0);
  p5.strokeWeight(1.4);
  p5.fill(255);
  p5.rectMode(p5.CORNERS);
  p5.rect(
    outerCoord.x - width,
    outerCoord.y + height,
    outerCoord.x,
    outerCoord.y,
    4,
    4,
    0,
    0,
  );
};
