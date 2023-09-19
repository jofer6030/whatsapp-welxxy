export function sanitizeText(text) {
  // Quitar tildes
  const cleanTextWithoutAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Convertir a minúsculas
  const cleanTextLowerCase = cleanTextWithoutAccents.toLowerCase();

  // Devolver el texto limpio
  return cleanTextLowerCase;
}
