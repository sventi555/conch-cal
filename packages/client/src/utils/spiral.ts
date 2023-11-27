import { CalendarConfig } from '../components/calendar/Calendar';
import { MS_PER_DAY } from './date';
import { TWO_PI, polarToCart } from './math';

export const SPIRAL_PARAMS = {
  a: 12,
  k: 0.1,
};

export const spiralCoord = (theta: number) => {
  return polarToCart(spiralRadius(theta), theta);
};

export const spiralRadius = (theta: number) => {
  const { a, k } = SPIRAL_PARAMS;
  return a * Math.pow(Math.E, k * theta);
};

// finds the angle on a spiral that gets closest to a radius of r at
// trajectory theta without overshooting it.
// The result will be theta + n*TWO_PI for some integer n.
export const closestSpiralAngle = (theta: number, r: number) => {
  let curAngle = theta;
  let spiralRad = spiralRadius(curAngle);
  while (spiralRad < r) {
    curAngle += TWO_PI;
    spiralRad = spiralRadius(curAngle);
  }

  return curAngle;
};

export const timeToAngle = (time: number, config: CalendarConfig) => {
  const { focusedTime, rotationsToFocus, rotationsPerDay } = config;
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return rotationsToFocus * TWO_PI - offsetFromFocus;
};

export const angleToTime = (theta: number, config: CalendarConfig) => {
  const { focusedTime, rotationsToFocus, rotationsPerDay } = config;
  return (
    focusedTime -
    (MS_PER_DAY * (theta - TWO_PI * rotationsToFocus)) /
      (TWO_PI * rotationsPerDay)
  );
};
