import { CalendarConfig } from '../../state/Calendar';
import { TWO_PI } from '../../utils/math';
import { DEFAULT_SAMPLES, spiralCoord } from '../../utils/spiral';
import { P5Component } from '../p5-component';
import { lineMarkerCoords } from './markers/utils';

export const WATCH_HEIGHT = 100;

interface WatchFaceProps {
  config: CalendarConfig;
  samplesPerRotation?: number;
}

export const drawWatchFaceBorder: P5Component<WatchFaceProps> = (
  p5,
  { config, samplesPerRotation = DEFAULT_SAMPLES },
) => {
  const sampleRate = TWO_PI / samplesPerRotation;
  const { inner, outer } = lineMarkerCoords(config.focusedTime, config);

  p5.stroke(0);
  p5.strokeWeight(1.4);
  p5.noFill();

  p5.beginShape();

  // bottom line
  p5.vertex(inner.x, inner.y);
  p5.vertex(outer.x, outer.y);

  // outer curve
  let curAngle = config.angleToFocus + sampleRate;
  let prevCoord = outer;
  while (true) {
    const curCoord = spiralCoord(curAngle);
    if (curCoord.y > outer.y + WATCH_HEIGHT) {
      break;
    }

    p5.vertex(curCoord.x, curCoord.y);

    prevCoord = curCoord;
    curAngle += sampleRate;
  }

  // top line
  const upperWidth = 200;
  p5.vertex(prevCoord.x - upperWidth, prevCoord.y);

  p5.endShape();
};

interface WatchFaceProps {
  config: CalendarConfig;
}

export const WatchFace: React.FC<WatchFaceProps> = ({ config }) => {
  const time = new Date(config.focusedTime);
  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeString = time.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });
  return (
    <div>
      <div>{dateString}</div>
      <div>{timeString}</div>
    </div>
  );
};
