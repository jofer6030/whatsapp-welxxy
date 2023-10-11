import fs from "node:fs";
import path from "node:path";

const directorio = path.resolve("memory");

export const memoryConversation = (nroCell, data) => {
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio);
  }

  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);

  if (!fs.existsSync(pathFile)) {
    fs.writeFileSync(pathFile, "");
  }

  const file = fs.readFileSync(pathFile, "utf-8");
  let infoToMemory;
  if (!file) {
    infoToMemory = [{ ...data }];
  } else {
    const parseFile = JSON.parse(file);
    infoToMemory = [...parseFile, data];
  }
  fs.writeFileSync(pathFile, JSON.stringify(infoToMemory));
  return infoToMemory;
};

export const memoryConversationAll = (nroCell) => {
  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);
  const file = fs.readFileSync(pathFile, "utf-8");
  const parseFile = JSON.parse(file);
  return parseFile;
};
