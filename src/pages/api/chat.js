import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export default async function chat(req, res) {
  const { question } = req.body;
  
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE,
    environment: process.env.ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.INDEX);
  
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );
  
  const model = new OpenAI();
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: 1,
    returnSourceDocuments: true,
  });
  const response = await chain.call({ query: question });
  console.log(response);

  res.status(200).json(response);
}
