/*
 * @Author: ChiaEnKang
 * @Date: 2026-06-18 13:18:42
 * @LastEditors: ChiaEnKang
 * @LastEditTime: 2026-06-18 13:25:52
 */
import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { convertUnitTool, convertUnit } from "./tools/unit_converter.js";
import { spinner } from "./utils/spinner.js";

const AVAILABLE_TOOLS = {
  convert_unit: convertUnit,
};

const tools = [convertUnitTool];

const messages = [
  {
    role: "user",
    content: "請幫我換算：25 度 C 是華氏幾度？10 公里等於幾英里？70 公斤是幾磅？ 30公尺等於幾英尺？",
  },
];
console.log(`請輸入你的問題: ${messages[0].content}\n`);
const askingSpinner = spinner("思考中...").start();

let response = await client.chat.completions.create({
  model: DEFAULT_MODEL,
  messages,
  tools,
  tool_choice: "auto",
});

askingSpinner.stop();

const message = response.choices[0].message;
messages.push(message);

if (message.tool_calls && message.tool_calls.length > 0) {
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

  const replySpinner = spinner("思考中...").start();

  response = await client.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
  });

  replySpinner.stop();

  console.log(response.choices[0].message.content);
} else {
  console.log(message.content);
}
