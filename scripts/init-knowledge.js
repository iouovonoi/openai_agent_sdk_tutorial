import {
  qdrant,
  KNOWLEDGE_COLLECTION,
  EMBEDDING_DIM,
  embed,
} from "../lib/qdrant.js";
import { devTools } from "../data/dev-tools.js";

function toolToText(tool) {
  return `${tool.name}｜${tool.category}｜${tool.description}｜${tool.useCase}`;
}

async function recreateCollection() {
  const exists = await qdrant.collectionExists(KNOWLEDGE_COLLECTION);
  if (exists.exists) {
    await qdrant.deleteCollection(KNOWLEDGE_COLLECTION);
  }

  await qdrant.createCollection(KNOWLEDGE_COLLECTION, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
}

async function main() {
  await recreateCollection();
  console.log(`已建立 collection: ${KNOWLEDGE_COLLECTION}`);

  const points = [];

  for (const tool of devTools) {
    const vector = await embed(toolToText(tool));
    points.push({
      id: tool.id,
      vector,
      payload: tool,
    });
    console.log(`已建立向量: ${tool.name}`);
  }

  await qdrant.upsert(KNOWLEDGE_COLLECTION, {
    wait: true,
    points,
  });

  console.log("知識庫初始化完成！");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
