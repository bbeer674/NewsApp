export const getYear = (date: Date | string) => {
  const year = new Date(date).getFullYear();
  return year;
};

export const getMonth = (date: Date | string) => {
  const month = new Date(date).getMonth();
  return month;
};
