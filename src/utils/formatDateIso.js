export const formatDateFromIso = (date) => {
  if (!date) return;
  // Crear un objeto Date a partir de la fecha ISO
  const fechaNormal = new Date(date);

  // Obtener los componentes de la fecha (día, mes, año)
  const day = fechaNormal.getDate();
  const month = fechaNormal.getMonth() + 1; // Los meses en JavaScript se cuentan desde 0 (enero) hasta 11 (diciembre)
  const year = fechaNormal.getFullYear();

  // Formatear la fecha en un formato deseado (por ejemplo, "dd/mm/yyyy")
  const formatedDate = day + "-" + month + "-" + year;

  return formatedDate; // Esto mostrará "28/6/1998" en la consola
};
