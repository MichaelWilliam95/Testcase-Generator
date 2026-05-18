function randomDouble(min, max, digits = 2) {
  const random = Math.random() * (max - min) + Number(min);
  return Number(random.toFixed(digits));
}

function formatToID(value, digits = 2) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function sortValues(values, order) {
  // Karena sekarang 'values' berisi Number mentah, 
  // kita tidak perlu lagi parseFloat atau replace koma.
  if (order === "increment") {
    return values.sort((a, b) => a - b);
  }

  if (order === "decrement") {
    return values.sort((a, b) => b - a);
  }

  return values;
}

export function generateFloat(config, slotCount = 1) {
  const input = config.inputs[0];
  const range = input.range || {};

  // Ekstrak konfigurasi di awal
  const min = range.min !== undefined ? Number(range.min) : 0;
  const max = range.max !== undefined ? Number(range.max) : 100;
  const digits = range.digit !== undefined ? Number(range.digit) : 2;
  const order = range.order;

  let rawValues = [];

  // 1. Generate angka mentah (Tipe data Number)
  for (let i = 0; i < slotCount; i++) {
    rawValues.push(randomDouble(min, max, digits));
  }

  // 2. Sorting angka mentahnya secara akurat
  rawValues = sortValues(rawValues, order);

  // 3. Format ke locale ID, lalu gabungkan dengan spasi
  return rawValues
    .map((val) => formatToID(val, digits))
    .join(" ");
}