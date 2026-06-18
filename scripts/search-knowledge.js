import { searchKnowledge } from "../lib/qdrant.js";

const questions = [
  "我想寫程式和管理專案檔案，應該用什麼工具？",
  "哪個工具可以幫我記錄程式碼版本，並把作業推到 GitHub？",
  "我要測試後端 API 回傳資料正不正確，適合用哪個工具？",
];

async function main() {
  for (const question of questions) {
    console.log(`\n問題：${question}`);

    const results = await searchKnowledge(question, 3);

    for (const [index, result] of results.entries()) {
      console.log(`${index + 1}. ${result.name} (${result.category})`);
      console.log(`   分數：${result.score.toFixed(3)}`);
      console.log(`   說明：${result.description}`);
      console.log(`   適合情境：${result.useCase}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
