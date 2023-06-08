import { CalendarConfig } from '../components/Calendar';
import { MS_PER_DAY } from './date';
import { TWO_PI, polarToCart } from './math';

export const spiralCoord = (theta: number, a: number, k: number) => {
  return polarToCart(spiralRadius(theta, a, k), theta);
};

export const spiralRadius = (theta: number, a: number, k: number) => {
  return a * Math.pow(Math.E, k * theta);
};

export const timeToAngle = (
  time: number,
  { focusedTime, rotationsToFocus, rotationsPerDay }: CalendarConfig,
) => {
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return rotationsToFocus * TWO_PI - offsetFromFocus;
};
