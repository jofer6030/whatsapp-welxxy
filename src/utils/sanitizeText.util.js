export function sanitizeText(text) {
  // Expresión regular para buscar emojis y caracteres especiales quitar las tildes
  const withoutAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\w\s]/g;

  // Remover emojis y caracteres especiales
  const cleanText = withoutAccents.replace(emojiRegex, "");

  // Aplicar trim para eliminar espacios en blanco al inicio y al final
  const trimmedText = cleanText.trim().toLowerCase();

  // Devolver el texto limpio
  return trimmedText;
}

console.log(sanitizeText("Dirección"));
