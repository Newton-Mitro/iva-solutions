const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateLicenseKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]);
  return `IVAC-${chars.slice(0,5).join("")}-${chars.slice(5,10).join("")}-${chars.slice(10,15).join("")}-${chars.slice(15,20).join("")}`;
}