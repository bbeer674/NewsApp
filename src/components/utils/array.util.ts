export const arrayRange = (start: number, stop: number, step = 1) => {
  if (start === stop) {
    return [start];
  }
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, index) => start + index * step
  );
};

export const sortAlphabeticallyAsc = (
  first: string,
  second: string
): number => {
  if (first > second) {
    return 1;
  } else if (first < second) {
    return -1;
  }
  return 0;
};

export const sortAlphabeticallyDesc = (
  first: string,
  second: string
): number => {
  if (first < second) {
    return 1;
  } else if (first > second) {
    return -1;
  }
  return 0;
};
