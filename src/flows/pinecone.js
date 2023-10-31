//pinecone.js

/**
Read .env
**/
// import * as dotenv from "dotenv";
// dotenv.config();

/**
Init Pinecone
**/
import { Pinecone } from "@pinecone-database/pinecone";
const pinecone = new Pinecone({
  environment: process.env['PINECONE_ENVIRONMENT'],
  apiKey: process.env['PINECONE_API_KEY'],
});

/**
Export the pinecone index function, named it based on your created index in pinecone. We will need this for Pinecone langchain wrapper.
**/
export const index = pinecone.Index("panaderia-memo");
