export const getDaysArray = (startDate, endDate) => {
  let dates = [];
  let theDate = startDate;
  while (theDate < endDate) {
    dates = [...dates, theDate];
    theDate += 86400000;
  }
  dates = [...dates, endDate];
  return dates;
};