export const convertUnitTool = {
  type: "function",
  function: {
    name: "convert_unit",
    description: "進行單位換算，支援攝氏與華氏、公裏與英裏、公斤與磅、公尺與英尺的換算。",
    parameters: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "要換算的數值，例如 25",
        },
        from_unit: {
          type: "string",
          description: "原始單位，例如 celsius、fahrenheit、km、mile、kg、lb、m、ft",
        },
        to_unit: {
          type: "string",
          description: "目標單位，例如 celsius、fahrenheit、km、mile、kg、lb、m、ft",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
};

export async function convertUnit({ value, from_unit, to_unit }) {
  const from = normalizeUnit(from_unit);
  const to = normalizeUnit(to_unit);

  if (from === "celsius" && to === "fahrenheit") {
    return {
      value,
      from_unit,
      to_unit,
      result: value * 9 / 5 + 32,
    };
  }

  if (from === "fahrenheit" && to === "celsius") {
    return {
      value,
      from_unit,
      to_unit,
      result: (value - 32) * 5 / 9,
    };
  }

  if (from === "km" && to === "mile") {
    return {
      value,
      from_unit,
      to_unit,
      result: value * 0.621371,
    };
  }

  if (from === "mile" && to === "km") {
    return {
      value,
      from_unit,
      to_unit,
      result: value / 0.621371,
    };
  }

  if (from === "kg" && to === "lb") {
    return {
      value,
      from_unit,
      to_unit,
      result: value * 2.20462,
    };
  }

  if (from === "lb" && to === "kg") {
    return {
      value,
      from_unit,
      to_unit,
      result: value / 2.20462,
    };
  }

  if (from === "m" && to === "ft") {
    return {
      value,
      from_unit,
      to_unit,
      result: value * 3.28084,
    };
  }

  if (from === "ft" && to === "m") {
    return {
      value,
      from_unit,
      to_unit,
      result: value / 3.28084,
    };
  }

  return {
    error: `不支援從 ${from_unit} 換算成 ${to_unit}`,
  };
}

function normalizeUnit(unit) {
  const text = unit.toLowerCase();

  if (text === "c" || text === "°c" || text === "攝氏") return "celsius";
  if (text === "f" || text === "°f" || text === "華氏") return "fahrenheit";
  if (text === "公里" || text === "公裏" || text === "kilometer") return "km";
  if (text === "英里" || text === "英裏") return "mile";
  if (text === "公斤" || text === "千克" || text === "kilogram") return "kg";
  if (text === "磅" || text === "pound") return "lb";
  if (text === "公尺" || text === "米" || text === "meter") return "m";
  if (text === "英尺" || text === "feet" || text === "foot") return "ft";

  return text;
}
