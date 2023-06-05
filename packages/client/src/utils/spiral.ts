import { MS_PER_DAY } from './date';
import { TWO_PI } from './math';

export const spiralRadius = (theta: number, a: number, k: number) => {
  return a * Math.pow(Math.E, k * theta);
};

export const timeToAngle = (
  time: number,
  focusedTime: number,
  rotationsToFocus: number,
  rotationsPerDay: number,
) => {
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return rotationsToFocus * TWO_PI - offsetFromFocus;
};
