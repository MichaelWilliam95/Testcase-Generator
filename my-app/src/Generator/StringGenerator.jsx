import RandExp from "randexp";

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function generateSingleString(
  inputConfig
) {
  const range =
    inputConfig.range || {};

  const isFixed =
    range.isFixed || false;

  const regex =
    range.regex || "";

  const length = isFixed
    ? Number(
        range.length || 5
      )
    : randomInt(
        1,
        Number(
          range.maxLength || 10
        )
      );

  let result = "";

  if (regex) {
    try {
      result = new RandExp(
        regex
      ).gen();

      while (
        isFixed &&
        result.length !==
          length
      ) {
        result =
          new RandExp(
            regex
          ).gen();
      }
    } catch {
      result = "INVALID_REGEX";
    }
  } else {
    const minAscii =
      range.minAscii
        ? Number(
            range.minAscii
          )
        : 97;

    const maxAscii =
      range.maxAscii
        ? Number(
            range.maxAscii
          )
        : 122;

    for (
      let i = 0;
      i < length;
      i++
    ) {
      result += String.fromCharCode(
        randomInt(
          minAscii,
          maxAscii
        )
      );
    }
  }

  return result;
}

function sortValues(
  values,
  order
) {
  if (order === "increment") {
    return values.sort();
  }

  if (order === "decrement") {
    return values.sort().reverse();
  }

  return values;
}

function generateRecursive(
  inputConfig
) {
  const firstValue =
    generateSingleString(
      inputConfig
    );

  let result = firstValue;

  if (
    inputConfig.isNested &&
    inputConfig.children?.length
  ) {
    const childConfig =
      inputConfig.children[0];

    let childValues = [];

    for (
      let i = 0;
      i < firstValue.length;
      i++
    ) {
      childValues.push(
        generateSingleString(
          childConfig
        )
      );
    }

    childValues = sortValues(
      childValues,
      childConfig.range
        ?.order
    );

    result +=
      "\n" +
      childValues.join(" ");
  }

  return result;
}

export function generateString(
  config,
  slotCount = 1
) {
  const input =
    config.inputs[0];

  if (input.isNested) {
    return generateRecursive(
      input
    );
  }

  let values = [];

  for (
    let i = 0;
    i < slotCount;
    i++
  ) {
    values.push(
      generateSingleString(
        input
      )
    );
  }

  values = sortValues(
    values,
    input.range?.order
  );

  return values.join(" ");
}