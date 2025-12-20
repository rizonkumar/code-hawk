import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

//TODO: code-hawk-v2 we can take it from env
export const pineconeindex = pinecone.index("code-hawk-v2");
