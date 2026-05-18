import { generateString } from "./stringGenerator";
import { generateInt } from "./intGenerator";
import { generateFloat } from "./floatGenerator";

export function generateInput(config) {
  return config.inputs.map((input) => {
    switch (input.type) {
      case "string":
        return generateString({ inputs: [input] });

      case "int":
        return generateInt({ inputs: [input] });

      case "float":
        return generateFloat({ inputs: [input] });

      default:
        return "";
    }
  });
}