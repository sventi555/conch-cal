import p5Types from 'p5';
import { useState } from 'react';
import Sketch from 'react-p5';
import { MS_PER_HOUR } from '../utils/date';
import { clamp } from '../utils/math';
import { drawEvent } from './Event';
import { drawFocusMarker, drawMarkers } from './Markers';
import { drawSpiral } from './Spiral';

interface Event {
  start: number;
  end: number;
  name: string;
}

interface CalendarProps {
  events: Event[];
}

export const Calendar = ({ events }: CalendarProps) => {
  const [zoom, setZoom] = useState(1);
  const [focusedTime, setFocusedTime] = useState(Date.now());

  const width = 600;
  const height = 600;

  const a = 12;
  const k = 0.1;
  const rotationsToFocus = 5;
  const totalRotations = rotationsToFocus + 1;

  const mouseWheel = (p5: p5Types, event?: UIEvent) => {
    if (event !== undefined) {
      updateFocus(event as WheelEvent);
    }
  };

  const updateFocus = (event: WheelEvent) => {
    const scrollIncrement = MS_PER_HOUR / zoom;
    if (event.deltaY > 0) {
      setFocusedTime(focusedTime + scrollIncrement);
    } else {
      setFocusedTime(focusedTime - scrollIncrement);
    }
  };

  const keyPressed = (p5: p5Types) => {
    if (p5.key === ' ') {
      setFocusedTime(Date.now());
      return;
    }

    updateZoom(p5);
  };

  const updateZoom = (p5: p5Types) => {
    let updatedVal: number;
    if (p5.key === '=') {
      updatedVal = zoom * 2;
    } else if (p5.key === '-') {
      updatedVal = zoom / 2;
    } else {
      return;
    }
    setZoom(clamp(updatedVal, 0.5, 4));
  };

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
      drawEvent(p5, {
        event,
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
    <Sketch
      keyPressed={keyPressed}
      mouseWheel={mouseWheel}
      setup={setup}
      draw={draw}
    />
  );
};
