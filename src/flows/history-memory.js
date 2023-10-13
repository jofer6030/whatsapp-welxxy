import fs from "node:fs";
import path from "node:path";

const directorio = path.resolve("memory");

export const memoryConversation = (nroCell, data) => {
  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);

  const file = fs.readFileSync(pathFile, "utf-8");
  if (!file) {
    fs.writeFileSync(pathFile, JSON.stringify([data]));
    return;
  }

  const parseFile = JSON.parse(file);
  const infoToMemory = [...parseFile, data];
  fs.writeFileSync(pathFile, JSON.stringify(infoToMemory));
};

export const getMemoryConversationAll = (nroCell) => {
  if (!fs.existsSync(directorio)) fs.mkdirSync(directorio);

  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);

  if (!fs.existsSync(pathFile)) fs.writeFileSync(pathFile, "");

  const file = fs.readFileSync(pathFile, "utf-8");

  if (!file) return [];

  const parseFile = JSON.parse(file);
  return parseFile;
};
