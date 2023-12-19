export const toIntOrUndefined = (str: string | undefined) => {
  if (str === undefined) {
    return undefined;
  }
  const num = parseInt(str, 10);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
};
