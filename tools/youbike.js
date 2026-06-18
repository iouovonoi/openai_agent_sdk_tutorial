import { z } from "zod";
import { defineTool } from "../utils/func-tool.js";

const YOUBIKE_API =
  "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json";

async function getYoubikeByArea({
  area,
  available_amount = 1,
  limit = 5,
}) {
  const res = await fetch(YOUBIKE_API);
  if (!res.ok) {
    return { error: `YouBike API error: ${res.status}` };
  }

  const data = await res.json();

  const stations = data
    .filter((s) => s.act === "1")
    .filter((s) => s.sarea === area)
    .map((s) => ({
      name: s.sna.replace(/^YouBike2\.0_/, ""),
      area: s.sarea,
      address: s.ar,
      available_rent: s.available_rent_bikes,
      available_return: s.available_return_bikes,
      total: s.Quantity,
    }))
    .filter((s) => s.available_rent >= available_amount)
    .sort((a, b) => b.available_rent - a.available_rent)
    .slice(0, limit);

  return {
    area,
    count: stations.length,
    stations,
  };
}

export const youbikeTool = defineTool({
  name: "get_youbike_by_area",
  description:
    "查詢台北市指定行政區目前可租借的 YouBike 站點。請使用行政區名稱，例如大安區、信義區。",
  fn: getYoubikeByArea,
  parameters: z.object({
    area: z.string().describe("台北市行政區名稱，例如大安區、信義區"),
    available_amount: z
      .number()
      .default(1)
      .describe("至少可租借車輛數，預設 1"),
    limit: z.number().default(5).describe("回傳筆數上限，預設 5"),
  }),
});
