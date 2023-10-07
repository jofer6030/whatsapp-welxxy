import fs from "node:fs";
import path from "node:path";
import { WELCOME_USER } from "./enumFlow.util.js";

const directorio = path.resolve("memory");

export const memoryConversation = (nroCell, data) => {
  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);
  const file = fs.readFileSync(pathFile, "utf-8");
  const parseFile = JSON.parse(file);
  const infoToMemory = { ...parseFile, conversations: [...parseFile.conversations, data] };
  fs.writeFileSync(pathFile, JSON.stringify(infoToMemory));
};

export const getStateFlow = (nroCell, message) => {
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio);
  }

  const pathFile = path.join(directorio, `conversation_${nroCell}.txt`);

  if (!fs.existsSync(pathFile)) {
    fs.writeFileSync(
      pathFile,
      JSON.stringify({ nroCell, conversations: [{ state: WELCOME_USER, messageUser: message }] })
    );
    return WELCOME_USER;
  }
  const parseInfoUser = JSON.parse(fs.readFileSync(pathFile, "utf-8"));
  const state = parseInfoUser.conversations[parseInfoUser.conversations.length - 1].state;
  return state;
};
