import p5Types from 'p5';
import { useState } from 'react';
import Sketch, { SketchProps } from 'react-p5';
import { Event } from '../../types';
import { MS_PER_HOUR } from '../../utils/date';
import { TWO_PI, canvasToCart, cartToPolar, clamp } from '../../utils/math';
import { eventInCanvas } from '../../utils/p5';
import { angleToTime, closestSpiralAngle } from '../../utils/spiral';
import { drawWatchFaceBorder } from './WatchFace';
import { drawEvent } from './event';
import { drawMarkers, drawOuterMask } from './markers';
import { drawSpiral } from './spiral';

export interface CalendarConfig {
  focusedTime: number;
  angleToFocus: number;
  rotationsPerDay: number;
}

interface CalendarProps {
  events: Event[];
  focusedTime: number;
  setFocusedTime: (time: number) => void;
  onClickTime: (time: number) => void;
  onClickEvent: (event: Event) => void;
}

export const Calendar: React.FC<CalendarProps> = (props) => {
  const [zoom, setZoom] = useState(2);

  const width = 800;
  const height = 800;

  const canvasTrans = {
    x: width / 2 - 40,
    y: height / 2 - 40,
  };

  const rotationsToFocus = 4;
  const angleToFocus = rotationsToFocus * TWO_PI;

  const config = {
    focusedTime: props.focusedTime,
    angleToFocus,
    rotationsPerDay: zoom,
  };

  const mouseWheel: SketchProps['mouseWheel'] = (p5, event) => {
    if (!eventInCanvas(event)) return;

    updateFocus(event as WheelEvent);
  };

  const updateFocus = (event: WheelEvent) => {
    const scrollIncrement = MS_PER_HOUR / zoom;
    if (event.deltaY > 0) {
      props.setFocusedTime(props.focusedTime + scrollIncrement);
    } else {
      props.setFocusedTime(props.focusedTime - scrollIncrement);
    }
  };

  const keyPressed: SketchProps['keyPressed'] = (p5) => {
    updateZoom(p5);
  };

  const mouseClicked: SketchProps['mouseClicked'] = (p5, event) => {
    if (!eventInCanvas(event)) return;

    const { r, theta } = cartToPolar(
      canvasToCart(
        { x: p5.mouseX, y: p5.mouseY },
        canvasTrans.x,
        canvasTrans.y,
      ),
    );
    const spiralAngle = closestSpiralAngle(theta, r);
    const time = angleToTime(spiralAngle, config);

    const clickedEvent = props.events.find(
      (event) => time >= event.start && time <= event.end,
    );

    if (clickedEvent) {
      props.onClickEvent(clickedEvent);
    } else {
      props.onClickTime(time);
    }
  };

  const updateZoom = (p5: p5Types) => {
    let updatedVal: number;
    if (p5.key === '=') {
      updatedVal = zoom + 1;
    } else if (p5.key === '-') {
      updatedVal = zoom - 1;
    } else {
      return;
    }
    setZoom(clamp(updatedVal, 1, 3));
  };

  const setup: SketchProps['setup'] = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw: SketchProps['draw'] = (p5) => {
    p5.background(255);

    p5.translate(canvasTrans.x, canvasTrans.y);
    p5.scale(1, -1);

    drawMarkers(p5, {
      config,
    });
    props.events.forEach((event) => {
      drawEvent(p5, {
        event,
        config,
      });
    });
    drawOuterMask(p5, { config });
    drawWatchFaceBorder(p5, { config });
    drawSpiral(p5, { stopAngle: angleToFocus });
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
