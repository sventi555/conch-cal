import { CalendarConfig } from '../components/calendar/Calendar';
import { MS_PER_DAY } from './date';
import { TWO_PI, polarToCart } from './math';

export const DEFAULT_SAMPLES = 1500;

export const SPIRAL_PARAMS = {
  a: 34,
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
  const { focusedTime, angleToFocus, rotationsPerDay } = config;
  const offsetFromFocus =
    ((time - focusedTime) / MS_PER_DAY) * rotationsPerDay * TWO_PI;

  return angleToFocus - offsetFromFocus;
};

export const angleToTime = (theta: number, config: CalendarConfig) => {
  const { focusedTime, angleToFocus, rotationsPerDay } = config;
  return (
    focusedTime -
    (MS_PER_DAY * (theta - angleToFocus)) / (TWO_PI * rotationsPerDay)
  );
};

// returns the angle that produces the rightmost spiral coord after completing `afterRotation` rotations
export const rightmostAngle = (
  afterRotation: number,
  samplesPerRotation = DEFAULT_SAMPLES,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  // can assume that the slope always starts as positive based on the spiral's orientation
  let posSlope = true;
  let curAngle = afterRotation * TWO_PI;
  let prevCoord = spiralCoord(curAngle);
  while (posSlope) {
    curAngle += sampleRate;
    const curCoord = spiralCoord(curAngle);

    posSlope = prevCoord.x < curCoord.x;
    prevCoord = curCoord;
  }
  curAngle -= sampleRate / 2;

  return curAngle;
};

export const angleNearestYCoord = (
  yCoord: number,
  afterRotation: number,
  samplesPerRotation = DEFAULT_SAMPLES,
) => {
  const sampleRate = TWO_PI / samplesPerRotation;

  let underY = true;
  let curAngle = afterRotation * TWO_PI;
  while (underY) {
    curAngle += sampleRate;
    const curCoord = spiralCoord(curAngle);

    underY = curCoord.y < yCoord;
  }
  curAngle -= sampleRate / 2;

  return curAngle;
};
