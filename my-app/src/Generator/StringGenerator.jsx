import RandExp from "randexp";

function randomInt(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

export function generateString(
  config,
  slotCount = 1
) {
  const input = config.inputs[0];
  const range = input.range || {};

  const isFixed =
    range.isFixed || false;

  const regex =
    range.regex || "";

  let results = [];

  for (
    let j = 0;
    j < slotCount;
    j++
  ) {
    let length = isFixed
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

        // kalau fixed length, paksa ulang
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

    results.push(result);
  }

  return results.join(" ");
}