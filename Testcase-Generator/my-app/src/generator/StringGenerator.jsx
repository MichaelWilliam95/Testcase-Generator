import RandExp from "randexp";

function generateString({ length = null, regex = null } = {}) {
  // CASE 1: kalau ada regex
  if (regex) {
    const randexp = new RandExp(regex);

    let result = randexp.gen();

    // kalau length juga diisi → coba sesuaikan
    if (length) {
      // kalau hasil terlalu panjang → potong
      if (result.length > length) {
        return result.slice(0, length);
      }

      // kalau terlalu pendek → generate ulang sampai cukup
      while (result.length < length) {
        result += randexp.gen();
      }

      return result.slice(0, length);
    }

    return result;
  }

  // CASE 2: hanya length
  if (length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  // CASE 3: default fallback
  return "default123";
}