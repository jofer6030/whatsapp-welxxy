export const isDniValid = (dni) => {
  return dni.length === 8 && !isNaN(Number(dni));
};
