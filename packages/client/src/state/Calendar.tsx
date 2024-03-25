// need to control state for focused time,

import {
  Dispatch,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { TWO_PI } from '../utils/math';

export interface CalendarConfig {
  focusedTime: number;
  angleToFocus: number;
  rotationsPerDay: number;
}

interface CalendarState {
  config: CalendarConfig;
  isLive: boolean;
}

interface SetFocusAction {
  type: 'set-focus';
  time: number;
}

interface LockToLiveAction {
  type: 'lock-to-live';
}

interface SetZoomAction {
  type: 'set-zoom';
  rotationsPerDay: number;
}

type CalendarAction = SetFocusAction | LockToLiveAction | SetZoomAction;

const calendarReducer: Reducer<CalendarState, CalendarAction> = (
  calendarState,
  action,
) => {
  switch (action.type) {
    case 'set-focus': {
      return { ...calendarState, focusedTime: action.time, isLive: false };
    }
    case 'lock-to-live': {
      return { ...calendarState, focusedTime: Date.now(), isLive: true };
    }
    case 'set-zoom': {
      return { ...calendarState, rotationsPerDay: action.rotationsPerDay };
    }
  }
};

export type CalendarDispatch = Dispatch<CalendarAction>;

const CalendarContext = createContext<CalendarState | undefined>(undefined);
const CalendarDispatchContext = createContext<CalendarDispatch | undefined>(
  undefined,
);

export const CalendarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const initialState: CalendarState = {
    config: {
      focusedTime: Date.now(),
      angleToFocus: 4 * TWO_PI,
      rotationsPerDay: 2,
    },
    isLive: true,
  };
  const [calendarState, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={calendarState}>
      <CalendarDispatchContext.Provider value={dispatch}>
        {children}
      </CalendarDispatchContext.Provider>
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const calendarState = useContext(CalendarContext);
  if (calendarState === undefined) {
    throw new Error('Using calendar context without a provider');
  }

  return calendarState;
};

export const useCalendarDispatch = () => {
  const dispatch = useContext(CalendarDispatchContext);
  if (dispatch === undefined) {
    throw new Error('Using calendar dispatch without a provider');
  }

  return dispatch;
};
