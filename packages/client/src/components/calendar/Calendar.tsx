import { Event } from 'lib';
import p5Types from 'p5';
import { useState } from 'react';
import Sketch, { SketchProps } from 'react-p5';
import { MS_PER_HOUR } from '../../utils/date';
import { canvasToCart, cartToPolar, clamp } from '../../utils/math';
import { eventInCanvas } from '../../utils/p5';
import { angleToTime, closestSpiralAngle } from '../../utils/spiral';
import { drawEvent } from './event';
import { drawFocusMarker, drawMarkers } from './markers';
import { drawSpiral } from './spiral';

export interface CalendarConfig {
  focusedTime: number;
  rotationsToFocus: number;
  rotationsPerDay: number;
}

interface CalendarProps {
  events: Event[];
  onClickTime: (time: number) => void;
  onClickEvent: (event: Event) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onClickTime,
  onClickEvent,
}) => {
  const [zoom, setZoom] = useState(1);
  const [focusedTime, setFocusedTime] = useState(Date.now());

  const width = 600;
  const height = 600;

  const a = 12;
  const k = 0.1;
  const rotationsToFocus = 5;
  const totalRotations = rotationsToFocus + 1;

  const config = {
    focusedTime,
    rotationsToFocus,
    rotationsPerDay: zoom,
  };

  const mouseWheel: SketchProps['mouseWheel'] = (p5, event) => {
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

  const keyPressed: SketchProps['keyPressed'] = (p5) => {
    if (p5.key === ' ') {
      setFocusedTime(Date.now());
      return;
    }

    updateZoom(p5);
  };

  const mouseClicked: SketchProps['mouseClicked'] = (p5, event) => {
    if (!eventInCanvas(event)) return;

    const { r, theta } = cartToPolar(
      canvasToCart({ x: p5.mouseX, y: p5.mouseY }, p5.width, p5.height),
    );
    const spiralAngle = closestSpiralAngle(theta, r, a, k);
    const time = angleToTime(spiralAngle, config);

    const clickedEvent = events.find(
      (event) => time >= event.start && time <= event.end,
    );

    if (clickedEvent) {
      onClickEvent(clickedEvent);
    } else {
      onClickTime(time);
    }
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

  const setup: SketchProps['setup'] = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw: SketchProps['draw'] = (p5) => {
    p5.background(255);

    p5.translate(p5.width / 2, p5.height / 2);
    p5.scale(1, -1);

    drawSpiral(p5, { rotations: totalRotations, a, k });
    drawMarkers(p5, {
      config,
      a,
      k,
    });
    events.forEach((event) => {
      drawEvent(p5, {
        event,
        config,
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
      mouseClicked={mouseClicked}
      setup={setup}
      draw={draw}
    />
  );
};
