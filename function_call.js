import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { spinner } from "./utils/spinner.js";
import { toOpenAITool } from "./utils/func-tool.js";
import * as allTools from "./tools/index.js";

const toolList = Object.values(allTools);
const tools = toolList.map(toOpenAITool);
const AVAILABLE_TOOLS = Object.fromEntries(toolList.map((t) => [t.name, t.fn]));

const testQuestions = [
  "現在幾點？",
  "信義區有 YouBike 可以借嗎？",
  "現在幾點？大安區還有 YouBike 可以借嗎？",
];

async function ask(question) {
  const messages = [
    {
      role: "developer",
      content:
        "你是一位台北生活助理，可以使用工具回答現在時間，也可以查詢台北市各行政區的 YouBike 可租借站點。查詢 YouBike 時請使用行政區名稱，例如大安區、信義區。使用者問台北市或不明確地點時，請提醒要提供行政區。",
    },
    { role: "user", content: question },
  ];

  console.log(`\n使用者：${question}`);

  while (true) {
    const spin = spinner("思考中...").start();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      tools,
      tool_choice: "auto",
    });

    spin.stop();

    const message = response.choices[0].message;
    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log(`AI：${message.content}`);
      break;
    }

    for (const toolCall of message.tool_calls) {
      const fnName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

      const fn = AVAILABLE_TOOLS[fnName];
      const result = await fn(args);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }
}

for (const question of testQuestions) {
  await ask(question);
}
