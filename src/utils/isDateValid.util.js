function isNumeric(value) {
  return /^\d+$/.test(value);
}

export function isFormatDateValid(date) {
  const regex = /^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/;
  return regex.test(date);
}

export function isDateValid(date) {
  const [day, month, year] = date.split("-").map(Number);

  const month30Dias = [4, 6, 9, 11];

  if (month === 2) {
    let maxDayFrebruary;
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      maxDayFrebruary = 29;
    } else {
      maxDayFrebruary = 28;
    }
    if (day > maxDayFrebruary) {
      throw new Error("El día no es válido para el mes y año ingresado");
    }
  } else if (month30Dias.includes(month)) {
    if (day > 30) throw new Error("El día maximo es 30 para el mes ingresado");
  } else {
    if (day > 31) throw new Error("El día maximo es 31 para el mes ingresado");
  }

  return true;
}
