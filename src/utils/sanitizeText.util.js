export function sanitizeText(text) {
  // Expresión regular para buscar emojis
  const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

  // Remover emojis
  const cleanTextWithoutEmojis = text.replace(emojiRegex, "");

  // Quitar tildes
  const cleanText = cleanTextWithoutEmojis.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Devolver el texto limpio
  return cleanText;
}
