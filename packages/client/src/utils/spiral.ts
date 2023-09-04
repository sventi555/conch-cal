import { CalendarConfig } from '../components/calendar/Calendar';
import { MS_PER_DAY } from './date';
import { TWO_PI, polarToCart } from './math';

export const spiralCoord = (theta: number, a: number, k: number) => {
  return polarToCart(spiralRadius(theta, a, k), theta);
};

export const spiralRadius = (theta: number, a: number, k: number) => {
  return a * Math.pow(Math.E, k * theta);
};

// finds the angle on a spiral that gets closest to a radius of r at
// trajectory theta without overshooting it.
// The result will be theta + n*TWO_PI for some integer n.
export const closestSpiralAngle = (
  theta: number,
  r: number,
  a: number,
  k: number,
) => {
  let curAngle = theta;
  let spiralRad = spiralRadius(curAngle, a, k);
  while (spiralRad < r) {
    curAngle += TWO_PI;
    spiralRad = spiralRadius(curAngle, a, k);
  }

  return curAngle;
};

export const timeToAngle = (
  time: number,
  { focusedTime, rotationsToFocus, rotationsPerDay }: CalendarConfig,
) => {
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return rotationsToFocus * TWO_PI - offsetFromFocus;
};

export const angleToTime = (
  theta: number,
  { focusedTime, rotationsToFocus, rotationsPerDay }: CalendarConfig,
) => {
  return (
    focusedTime -
    (MS_PER_DAY * (theta - TWO_PI * rotationsToFocus)) /
      (TWO_PI * rotationsPerDay)
  );
};
