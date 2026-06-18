import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
});

export const KNOWLEDGE_COLLECTION = "dev_tools_knowledge";
export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIM = 1536;

export async function embed(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return res.data[0].embedding;
}

export async function searchKnowledge(query, limit = 3) {
  const vector = await embed(query);

  const results = await qdrant.search(KNOWLEDGE_COLLECTION, {
    vector,
    limit,
    with_payload: true,
  });

  return results.map((r) => ({
    score: r.score,
    name: r.payload.name,
    category: r.payload.category,
    description: r.payload.description,
    useCase: r.payload.useCase,
  }));
}
