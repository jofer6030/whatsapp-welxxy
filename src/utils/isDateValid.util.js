function isNumeric(value) {
  return /^\d+$/.test(value);
}

export function isFormatDateValid(date) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
  return regex.test(date);
}

export function isDateValid(date) {
  const [day, month, year] = date.split("-").map(Number);

  if (!isNumeric(day) || !isNumeric(month) || !isNumeric(year)) return false;

  const numericDay = Number(day);
  const numericMonth = Number(month);
  const numericYear = Number(year);

  const month30Dias = [4, 6, 9, 11];

  if (numericMonth < 1 || numericMonth > 12) return false;

  if (numericDay < 1) return false;

  if (numericMonth === 2) {
    let maxDayFrebruary;
    if ((numericYear % 4 === 0 && numericYear % 100 !== 0) || numericYear % 400 === 0) {
      maxDayFrebruary = 29;
    } else {
      maxDayFrebruary = 28;
    }
    if (numericDay > maxDayFrebruary) return false;
  } else if (month30Dias.includes(numericMonth)) {
    if (numericDay > 30) {
      return false;
    }
  } else {
    if (numericDay > 31) {
      return false;
    }
  }

  return true;
}
