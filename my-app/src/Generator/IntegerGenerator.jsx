function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function generateByDigit(digit) {
  const min = Math.pow(10, digit - 1);
  const max =
    Math.pow(10, digit) - 1;

  return randomInt(min, max);
}

function applyMultiple(
  value,
  multipleOf,
  min,
  max
) {
  if (!multipleOf) return value;

  const multiple =
    Number(multipleOf);

  let result =
    Math.round(
      value / multiple
    ) * multiple;

  if (result < min)
    result = min;

  if (result > max)
    result = max;

  return result;
}

function generateSingleValue(
  inputConfig
) {
  const range =
    inputConfig.range || {};

  const min = range.min
    ? Number(range.min)
    : 1;

  const max = range.max
    ? Number(range.max)
    : 100;

  const digit = range.digit
    ? Number(range.digit)
    : null;

  let value = digit
    ? generateByDigit(digit)
    : randomInt(min, max);

  value = applyMultiple(
    value,
    range.multipleOf,
    min,
    max
  );

  return value;
}

function sortValues(
  values,
  order
) {
  if (order === "increment") {
    return values.sort(
      (a, b) => a - b
    );
  }

  if (order === "decrement") {
    return values.sort(
      (a, b) => b - a
    );
  }

  return values;
}

function generateRecursive(
  inputConfig
) {
  const firstValue =
    generateSingleValue(
      inputConfig
    );

  let result = String(
    firstValue
  );

  if (
    inputConfig.isNested &&
    inputConfig.children?.length
  ) {
    const childConfig =
      inputConfig.children[0];

    let childValues = [];

    for (
      let i = 0;
      i < firstValue;
      i++
    ) {
      childValues.push(
        generateSingleValue(
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

export function generateInteger(
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
      generateSingleValue(
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