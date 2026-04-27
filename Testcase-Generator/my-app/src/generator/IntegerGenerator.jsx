function generateRandom({ min, max, digits } = {}) {
  // Jika pakai digits → override min & max
  if (digits !== undefined) {
    min = Math.pow(10, digits - 1);
    max = Math.pow(10, digits) - 1;
  }

  // Default kalau tidak diisi
  if (min === undefined) min = 0;
  if (max === undefined) max = 100;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}