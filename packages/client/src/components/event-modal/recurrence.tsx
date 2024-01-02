import { Frequency, WeekdayStr } from 'rrule';
import { Recurrence } from '../../types';
import {
  MS_PER_WEEK,
  dateFromDayAndTimeString,
  dayAndTimeStringFromDate,
} from '../../utils/date';
import { CheckboxGroup } from './checkbox-group';
import { Dropdown } from './dropdown';
import { NumberInput } from './number';
import { Radio } from './radio';
import { RadioDay } from './radio-day';
import { RadioNumber } from './radio-number';

const defaultRecurrence = (start: number): Recurrence => ({
  start,
  freq: Frequency.WEEKLY,
});

interface RecurrenceProps {
  eventStart: number;
  recurrence?: Recurrence;
  onChangeRecurrence: (recurrence: Recurrence | undefined) => void;
}

type FreqString = keyof typeof Frequency | 'NONE';

const fromFreqString = (freqString: FreqString): Frequency | undefined => {
  if (freqString === 'NONE') {
    return undefined;
  }

  return Frequency[freqString];
};

const toFreqString = (frequency: Frequency | undefined): FreqString => {
  switch (frequency) {
    case Frequency.DAILY:
      return 'DAILY';
    case Frequency.WEEKLY:
      return 'WEEKLY';
    case Frequency.MONTHLY:
      return 'MONTHLY';
    case Frequency.YEARLY:
      return 'YEARLY';
    default:
      return 'NONE';
  }
};

export const RecurrenceForm: React.FC<RecurrenceProps> = (props) => {
  const recurrence = props.recurrence;

  return (
    <div>
      <Dropdown<FreqString>
        label="Repeats"
        options={[
          { label: 'None', val: 'NONE' },
          { label: 'Daily', val: 'DAILY' },
          { label: 'Weekly', val: 'WEEKLY' },
          { label: 'Monthly', val: 'MONTHLY' },
          { label: 'Yearly', val: 'YEARLY' },
        ]}
        selected={toFreqString(recurrence?.freq)}
        onChange={(freqString) => {
          const freq = fromFreqString(freqString);
          if (freq == null) {
            props.onChangeRecurrence(undefined);
          } else if (recurrence == null) {
            props.onChangeRecurrence({
              ...defaultRecurrence(props.eventStart),
              freq,
            });
          } else {
            props.onChangeRecurrence({
              ...recurrence,
              freq,
            });
          }
        }}
      />
      {recurrence != null ? (
        <>
          <NumberInput
            label="Interval"
            val={recurrence.interval ?? 1}
            onChange={(num) =>
              props.onChangeRecurrence({
                ...recurrence,
                interval: num,
              })
            }
            min={1}
          />
          <CheckboxGroup<WeekdayStr>
            label="By day:"
            options={[
              { label: 'SU', val: 'SU' },
              { label: 'MO', val: 'MO' },
              { label: 'TU', val: 'TU' },
              { label: 'WE', val: 'WE' },
              { label: 'TH', val: 'TH' },
              { label: 'FR', val: 'FR' },
              { label: 'SA', val: 'SA' },
            ]}
            checkedVals={new Set(recurrence.byweekday ?? [])}
            onChange={(val, checked) => {
              const newWeekdays = new Set(recurrence.byweekday);
              if (checked) {
                newWeekdays.add(val);
              } else {
                newWeekdays.delete(val);
              }
              props.onChangeRecurrence({
                ...recurrence,
                byweekday: Array.from(newWeekdays),
              });
            }}
          />
          <Radio
            label="Never ends"
            checked={recurrence.count == null && recurrence.until == null}
            onChange={() =>
              props.onChangeRecurrence({
                ...recurrence,
                count: undefined,
                until: undefined,
              })
            }
          />
          <RadioDay
            label="Until"
            checked={recurrence.until != null}
            onChecked={(day) =>
              props.onChangeRecurrence({
                ...recurrence,
                until: dateFromDayAndTimeString(day, '00:00'),
                count: undefined,
              })
            }
            day={
              dayAndTimeStringFromDate(
                recurrence.until ?? props.eventStart + MS_PER_WEEK * 3,
              ).day
            }
            onChangeDay={(day) =>
              props.onChangeRecurrence({
                ...recurrence,
                until: dateFromDayAndTimeString(day, '00:00'),
                count: undefined,
              })
            }
          />
          <RadioNumber
            label="Count"
            checked={recurrence.count != null}
            onChecked={(num) =>
              props.onChangeRecurrence({
                ...recurrence,
                count: num,
                until: undefined,
              })
            }
            num={recurrence.count ?? 1}
            onChangeNum={(num) =>
              props.onChangeRecurrence({
                ...recurrence,
                count: num,
                until: undefined,
              })
            }
            min={1}
          />
        </>
      ) : null}
    </div>
  );
};
