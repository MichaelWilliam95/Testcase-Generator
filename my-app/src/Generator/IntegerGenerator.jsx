import { generateString } from "./StringGenerator";
import { generateFloat } from "./FloatGenerator";

// Helper untuk membuat angka acak berdasarkan rentang min & max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper untuk membuat angka acak berdasarkan jumlah digit yang diinginkan
function generateByDigit(digit) {
  const min = Math.pow(10, digit - 1);
  const max = Math.pow(10, digit) - 1;
  return randomInt(min, max);
}

// Helper untuk menerapkan aturan kelipatan angka (Multiple Of) secara aman
function applyMultiple(value, multipleOf, min, max) {
  if (!multipleOf) return value;

  const multiple = Number(multipleOf);
  let result = Math.round(value / multiple) * multiple;

  if (result < min) result = min;
  if (result > max) result = max;

  return result;
}

// Fungsi inti untuk memproduksi SATU nilai angka acak berdasarkan konfigurasi
function generateSingleValue(inputConfig) {
  const range = inputConfig.range || {};

  const min = range.min !== "" ? Number(range.min) : 1;
  const max = range.max !== "" ? Number(range.max) : 100;
  const digit = range.digit !== "" ? Number(range.digit) : null;

  let value = digit ? generateByDigit(digit) : randomInt(min, max);

  value = applyMultiple(value, range.multipleOf, min, max);

  return value;
}

// Helper untuk melakukan pengurutan data (Sorting) jika diaktifkan
function sortValues(values, order) {
  if (order === "increment") {
    return values.sort((a, b) => a - b);
  }
  if (order === "decrement") {
    return values.sort((a, b) => b - a);
  }
  return values;
}

/* =========================================================================
   MAIN EXPORT: SUDAH DISINKRONISASI DENGAN APP.JSX (ANTI-DOUBLE-LOOPING)
========================================================================= */
export function generateInteger(config, slotCount = 1) {
  const input = config.inputs?.[0];
  if (!input) return "";

  /* KASUS A: INPUT BERSARANG (NESTED CHILD)
    Saat mode nested aktif, App.jsx akan memanggil fungsi ini dengan slotCount = 1.
    Tugas generator di sini HANYA mengembalikan 1 nilai angka murni (string) 
    tanpa bumbu spasi atau enter sama sekali.
  */
  if (input.isNested) {
    return String(generateSingleValue(input));
  }

  /* KASUS B: DATA TUNGGAL BIASA ATAU ARRAY 2D (NON-NESTED)
    Logika di bawah ini tetap dipertahankan untuk backward-compatibility 
    jika Anda men-generate data kolom array biasa.
  */
  let values = [];
  for (let i = 0; i < slotCount; i++) {
    values.push(generateSingleValue(input));
  }

  // Jalankan aturan sorting (increment/decrement) jika ada
  values = sortValues(values, input.range?.order);

  // Jika ini bagian dari struktur Array 2D, gabungkan kolom ke samping dengan spasi
  if (config.count && config.count > 0) {
    return values.map(String).join(" ");
  }

  // Jika Single Input biasa, gabungkan ke bawah dengan enter jika slotCount > 1
  return slotCount === 1 ? String(values[0]) : values.map(String).join("\n");
}