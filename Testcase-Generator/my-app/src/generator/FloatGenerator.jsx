// default digit = 2 (bisa diubah lewat parameter)
export function generateRandomDouble(min, max, digits = 2) {
  const random = Math.random() * (max - min) + Number(min);

  // bulatkan sesuai digit
  return Number(random.toFixed(digits));
}

// format ke Indonesia (koma)
export function formatToID(value, digits = 2) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

// langsung generate + format
export function generateFormatted(min, max, digits = 2) {
  const value = generateRandomDouble(min, max, digits);
  return formatToID(value, digits);
}