import fs from "node:fs";
import path from "node:path";
import { WELCOME_USER } from "./enumFlow.util.js";

const directorio = path.resolve("memory");

export const memoryConversation = (nroCell, data) => {
  console.log("entro", data);
  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);
  const file = fs.readFileSync(pathFile, "utf-8");
  let infoToMemory;
  if (!file) {
    infoToMemory = { nroCell, conversations: [data] };
  } else {
    const parseFile = JSON.parse(file);
    infoToMemory = { ...parseFile, conversations: [...parseFile.conversations, data] };
  }
  fs.writeFileSync(pathFile, JSON.stringify(infoToMemory));
};

export const getStateFlow = (nroCell) => {
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio);
  }

  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);

  if (!fs.existsSync(pathFile)) {
    fs.writeFileSync(pathFile, "");
    return WELCOME_USER;
  }
  const parseInfoUser = JSON.parse(fs.readFileSync(pathFile, "utf-8"));
  const state = parseInfoUser.conversations[parseInfoUser.conversations.length - 1].state;
  return state;
};
