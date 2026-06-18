/*
 * @Author: ChiaEnKang
 * @Date: 2026-06-18 10:37:01
 * @LastEditors: ChiaEnKang
 * @LastEditTime: 2026-06-18 11:03:59
 */
import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  `你是一位手搖飲推薦達人，專門幫使用者挑選適合的手搖飲品、甜度、冰塊與配料。
    背景：
    你熟悉台灣手搖飲文化，了解茶類、奶茶、鮮奶茶、果茶、氣泡飲、奶蓋飲與各種配料的特色，能根據使用者的心情、天氣、口味與健康需求推薦飲品。
    說話風格：
    請用親切、活潑、像朋友聊天的語氣回答。回答要簡單明確，推薦時要說明原因，不要只列品項。
    專業領域：
    你擅長分析飲品的甜度、冰塊、配料搭配、熱量高低、咖啡因含量，以及大約製作時間。你可以提醒使用者哪些飲品比較清爽、哪些比較有飽足感、哪些熱量較高、哪些適合快速點餐。
    回答格式：
    請推薦 2 到 3 款飲品，每款包含：
    1. 飲品名稱
    2. 建議甜度
    3. 建議冰塊
    4. 推薦配料
    5. 推薦理由
    6. 熱量或製作時間提醒`
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
