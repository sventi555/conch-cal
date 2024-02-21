import { TWO_PI, lerp } from '../../utils/math';
import { RGBA } from '../../utils/p5';
import { DEFAULT_SAMPLES, spiralCoord } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { CalendarConfig } from './Calendar';

interface BlockProps {
  startAngle: number;
  endAngle: number;
  color: RGBA;
  config: CalendarConfig;
  crossSection?: {
    start: number;
    end: number;
  };
  samplesPerRotation?: number;
}

export const drawBlock: P5Component<BlockProps> = (
  p5,
  {
    startAngle,
    endAngle,
    color,
    crossSection = { start: 0, end: 1 },
    samplesPerRotation = DEFAULT_SAMPLES,
  },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  p5.noStroke();
  p5.fill(...color);

  p5.beginShape();

  // outer arc
  for (let theta = startAngle; theta >= endAngle; theta -= sampleRate) {
    const innerCoord = spiralCoord(theta - TWO_PI);
    const outerCoord = spiralCoord(theta);
    const shiftedOuter = {
      x: lerp(innerCoord.x, outerCoord.x, crossSection.end),
      y: lerp(innerCoord.y, outerCoord.y, crossSection.end),
    };
    p5.vertex(shiftedOuter.x, shiftedOuter.y);
  }

  // inner arc
  for (let theta = endAngle; theta <= startAngle; theta += sampleRate) {
    const innerCoord = spiralCoord(theta - TWO_PI);
    const outerCoord = spiralCoord(theta);
    const shiftedInner = {
      x: lerp(innerCoord.x, outerCoord.x, crossSection.start),
      y: lerp(innerCoord.y, outerCoord.y, crossSection.start),
    };
    p5.vertex(shiftedInner.x, shiftedInner.y);
  }

  p5.endShape();
};
