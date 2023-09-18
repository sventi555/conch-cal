export const toInt = (str: string | undefined) => {
  if (str === undefined) {
    return undefined;
  }
  const num = parseInt(str, 10);
  if (isNaN(num)) {
    return undefined;
  }
  return num;
};

export const toBool = (str: string | undefined) => {
  return str === 'true';
};
