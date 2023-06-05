import { FocusMarker, Markers } from './Markers';
import { Spiral } from './Spiral';
import { TimeBlock } from './TimeBlock';

interface Event {
  start: number;
  end: number;
  name: string;
}

interface CalendarProps {
  events: Event[];
  zoom: number;
  focusedTime: number;
}

export const Calendar = ({ events, zoom, focusedTime }: CalendarProps) => {
  const width = 600;
  const height = 600;

  const a = 6;
  const k = 0.1;
  const rotationsToFocus = 6;
  const totalRotations = rotationsToFocus + 1;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2}) scale(1, -1)`}>
        <Spiral rotations={totalRotations} a={a} k={k} />
        <Markers
          focusedTime={focusedTime}
          rotationsToFocus={rotationsToFocus}
          rotationsPerDay={zoom}
          a={a}
          k={0.1}
        />
        {events.map((event) => (
          <TimeBlock
            start={event.start}
            end={event.end}
            focusedTime={focusedTime}
            rotationsToFocus={rotationsToFocus}
            rotationsPerDay={zoom}
            a={a}
            k={k}
            key={event.start}
          />
        ))}
        <FocusMarker rotationsToFocus={rotationsToFocus} a={a} k={k} />
      </g>
    </svg>
  );
};
