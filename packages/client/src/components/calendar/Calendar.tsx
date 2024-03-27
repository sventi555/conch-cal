import p5Types from 'p5';
import { PropsWithChildren, useEffect } from 'react';
import Sketch, { SketchProps } from 'react-p5';
import {
  CalendarConfig,
  useCalendar,
  useCalendarDispatch,
} from '../../state/Calendar';
import { useEvents } from '../../state/Events';
import { Event } from '../../types';
import { MS_PER_HOUR } from '../../utils/date';
import { cartToPolar, clamp, dist } from '../../utils/math';
import {
  CANVAS_HEIGHT,
  CANVAS_TRANS,
  CANVAS_WIDTH,
  canvasToCart,
  cartToCanvas,
  eventInCanvas,
} from '../../utils/p5';
import { angleToTime, closestSpiralAngle } from '../../utils/spiral';
import { WATCH_HEIGHT, WatchFace, drawWatchFaceBorder } from './WatchFace';
import { drawEvent } from './event';
import { drawMarkers, drawOuterMask } from './markers';
import { lineMarkerCoords } from './markers/utils';
import { drawSpiral } from './spiral';

interface CalendarProps {
  onClickTime: (time: number) => void;
  onClickEvent: (event: Event) => void;
}

export const Calendar: React.FC<CalendarProps> = (props) => {
  const events = useEvents();
  const { focusedTime, rotationsPerDay, angleToFocus, isLive } = useCalendar();
  const config = { focusedTime, rotationsPerDay, angleToFocus };
  const dispatch = useCalendarDispatch();

  useEffect(() => {
    if (isLive) {
      const updateTimeHandler = setInterval(
        () => dispatch({ type: 'update-live-time' }),
        1000,
      );
      return () => clearInterval(updateTimeHandler);
    }
  }, [isLive, dispatch]);

  const mouseWheel: SketchProps['mouseWheel'] = (p5, event) => {
    if (!eventInCanvas(event)) return;

    updateFocus(event as WheelEvent);
  };

  const updateFocus = (event: WheelEvent) => {
    const scrollIncrement = MS_PER_HOUR / rotationsPerDay;
    if (event.deltaY > 0) {
      dispatch({
        type: 'set-focus',
        time: focusedTime + scrollIncrement,
      });
    } else {
      dispatch({
        type: 'set-focus',
        time: focusedTime - scrollIncrement,
      });
    }
  };

  const keyPressed: SketchProps['keyPressed'] = (p5) => {
    updateZoom(p5);
  };

  const mouseClicked: SketchProps['mouseClicked'] = (p5, event) => {
    if (!eventInCanvas(event)) return;

    const { r, theta } = cartToPolar(
      canvasToCart({ x: p5.mouseX, y: p5.mouseY }),
    );
    const spiralAngle = closestSpiralAngle(theta, r);
    const time = angleToTime(spiralAngle, config);

    const clickedEvent = events.find(
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
      updatedVal = rotationsPerDay + 1;
    } else if (p5.key === '-') {
      updatedVal = rotationsPerDay - 1;
    } else {
      return;
    }
    dispatch({ type: 'set-zoom', rotationsPerDay: clamp(updatedVal, 1, 3) });
  };

  const setup: SketchProps['setup'] = (p5, canvasParentRef) => {
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
  };

  const draw: SketchProps['draw'] = (p5) => {
    p5.background(255);

    p5.translate(CANVAS_TRANS.x, CANVAS_TRANS.y);
    p5.scale(1, -1);

    drawMarkers(p5, {
      config,
    });
    events.forEach((event) => {
      drawEvent(p5, {
        event,
        config,
      });
    });
    drawOuterMask(p5, { config });
    drawSpiral(p5, { stopAngle: angleToFocus });
    drawWatchFaceBorder(p5, { config, isLive });
  };

  return (
    <div className="relative">
      <Sketch
        keyPressed={keyPressed}
        mouseWheel={mouseWheel}
        mouseClicked={mouseClicked}
        setup={setup}
        draw={draw}
      />
      <WatchFaceWrapper config={config}>
        <WatchFace config={config} />
      </WatchFaceWrapper>
    </div>
  );
};

interface WatchFaceWrapperProps {
  config: CalendarConfig;
}

const WatchFaceWrapper: React.FC<PropsWithChildren<WatchFaceWrapperProps>> = ({
  config,
  children,
}) => {
  const { inner, outer } = lineMarkerCoords(config.focusedTime, config);
  const lineLen = dist(inner, outer);
  const bottomLeft = cartToCanvas(inner);
  const padding = 8;

  return (
    <div
      className="absolute"
      style={{
        width: lineLen - padding * 2,
        height: WATCH_HEIGHT - padding * 2,
        bottom: CANVAS_HEIGHT - bottomLeft.y + padding,
        left: bottomLeft.x + padding,
      }}
    >
      {children}
    </div>
  );
};
