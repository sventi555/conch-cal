import { CalendarConfig } from '../../../state/Calendar';
import { TWO_PI } from '../../../utils/math';
import { spiralCoord, timeToAngle } from '../../../utils/spiral';

export const lineMarkerCoords = (time: number, config: CalendarConfig) => {
  const theta = timeToAngle(time, config);

  const outer = spiralCoord(theta);
  const inner = spiralCoord(theta - TWO_PI);

  return { inner, outer, theta };
};
