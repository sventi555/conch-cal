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
    endAngle: angle,
  });

  const height = 100;
  const lowerWidth = 190;
  const upperWidth = 202;

  p5.stroke(0);
  p5.strokeWeight(1.4);

  p5.beginShape();
  p5.vertex(outerCoord.x - lowerWidth, outerCoord.y);
  p5.vertex(outerCoord.x, outerCoord.y);
  p5.vertex(outerCoord.x, outerCoord.y + height);
  // TODO maybe put border radius between these two
  p5.vertex(outerCoord.x - upperWidth, outerCoord.y + height);
  p5.endShape();
};
