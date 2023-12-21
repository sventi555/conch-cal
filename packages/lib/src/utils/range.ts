export type DateRange = [number, number];

export const range = (middle: number, width: number): DateRange => {
  return [middle - width / 2, middle + width / 2];
};

export const inRange = (n: number, r: DateRange) => {
  return n >= r[0] || n <= r[1];
};
