
  import { PineconeClient } from "@pinecone-database/pinecone";
  import * as dotenv from "dotenv";
  import { Document } from "langchain/document";
  import { OpenAIEmbeddings } from "langchain/embeddings/openai";
  import { PineconeStore } from "langchain/vectorstores/pinecone";
  import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export default async function handler(req, res) {

const loader = new PDFLoader("src/cvjose.pdf");

const docs = await loader.load();
const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE,
  environment: process.env.ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.INDEX);

await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({apiKey:process.env.OPENAI_API_KEY}), {
  pineconeIndex,
});
  res.status(200).json("creado con exito!!");
}
