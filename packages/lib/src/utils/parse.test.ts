import { toInt } from './parse';

describe('parse', () => {
  describe('toInt', () => {
    it('should return undefined if undefined', () => {
      expect(toInt(undefined)).toBe(undefined);
    });

    it('should return undefined if NaN', () => {
      expect(toInt('foo')).toBe(undefined);
    });

    it('should return number if number', () => {
      expect(toInt('1')).toBe(1);
    });
  });
});
