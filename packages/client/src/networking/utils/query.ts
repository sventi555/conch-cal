export const toQueryString = (
  obj: Record<string, { toString: () => string }>,
) => {
  const stringified = Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, val.toString()]),
  );

  return new URLSearchParams(stringified);
};
