import p5Types from 'p5';
import { MS_PER_DAY, MS_PER_HOUR } from '../utils/date';
import { TWO_PI, dist, lerp, polarToCart } from '../utils/math';
import { spiralRadius, timeToAngle } from '../utils/spiral';

interface MarkersProps {
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

export const drawMarkers = (
  p5: p5Types,
  { focusedTime, rotationsToFocus, rotationsPerDay, a, k }: MarkersProps,
) => {
  const lastHour = focusedTime - (focusedTime % MS_PER_HOUR);
  const centerTime =
    focusedTime + (rotationsToFocus / rotationsPerDay) * MS_PER_DAY;

  const markerTimes: number[] = [];
  for (let time = lastHour; time < centerTime; time += MS_PER_HOUR) {
    markerTimes.push(time);
  }

  markerTimes.forEach((time) => {
    drawMarker(p5, {
      time,
      focusedTime,
      rotationsToFocus,
      rotationsPerDay,
      a,
      k,
    });
  });
};

interface MarkerProps {
  time: number;
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
  a: number;
  k: number;
}

const drawMarker = (
  p5: p5Types,
  { time, focusedTime, rotationsToFocus, rotationsPerDay, a, k }: MarkerProps,
) => {
  const theta = timeToAngle(
    time,
    focusedTime,
    rotationsToFocus,
    rotationsPerDay,
  );

  const outerPoint = polarToCart(spiralRadius(theta, a, k), theta);
  const innerPoint = polarToCart(spiralRadius(theta - TWO_PI, a, k), theta);

  const textCoords = {
    x: lerp(innerPoint.x, outerPoint.x, 0.02),
    y: lerp(innerPoint.y, outerPoint.y, 0.02),
  };

  p5.stroke(0);
  p5.fill(0);

  // marker line
  p5.line(outerPoint.x, outerPoint.y, innerPoint.x, innerPoint.y);

  p5.noStroke();

  // hour text
  p5.push();
  p5.translate(textCoords.x, textCoords.y);
  p5.scale(1, -1);
  p5.rotate(-theta);
  p5.translate(0, -2);
  p5.textSize(dist(innerPoint, outerPoint) / 6);
  p5.text(new Date(time).getHours(), 0, 0);
  p5.pop();
};

interface FocusMarkerProps {
  rotationsToFocus: number;
  a: number;
  k: number;
}

export const drawFocusMarker = (
  p5: p5Types,
  { rotationsToFocus, a, k }: FocusMarkerProps,
) => {
  const focusOuterPoint = polarToCart(
    spiralRadius(rotationsToFocus * TWO_PI + TWO_PI, a, k),
    0,
  );

  p5.stroke(255, 0, 0);
  p5.line(0, 0, focusOuterPoint.x, focusOuterPoint.y);
};
