import p5Types from 'p5';
import { useState } from 'react';
import Sketch from 'react-p5';
import { drawFocusMarker, drawMarkers } from './Markers';
import { drawSpiral } from './Spiral';
import { drawTimeBlock } from './TimeBlock';

interface Event {
  start: number;
  end: number;
  name: string;
}

interface CalendarProps {
  events: Event[];
}

export const Calendar = ({ events }: CalendarProps) => {
  const [zoom] = useState(1);
  const [focusedTime] = useState(Date.now());

  const width = 600;
  const height = 600;

  const a = 6;
  const k = 0.1;
  const rotationsToFocus = 6;
  const totalRotations = rotationsToFocus + 1;

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(255);

    p5.translate(p5.width / 2, p5.height / 2);
    p5.scale(1, -1);

    drawSpiral(p5, { rotations: totalRotations, a, k });
    drawMarkers(p5, {
      focusedTime,
      rotationsToFocus,
      rotationsPerDay: zoom,
      a,
      k,
    });
    events.forEach((event) => {
      drawTimeBlock(p5, {
        start: event.start,
        end: event.end,
        focusedTime,
        rotationsToFocus,
        rotationsPerDay: zoom,
        a,
        k,
      });
    });
    drawFocusMarker(p5, { rotationsToFocus, a, k });
  };

  return (
    <>
      <Sketch setup={setup} draw={draw} />;
    </>
  );
};
