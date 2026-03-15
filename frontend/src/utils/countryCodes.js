export const COUNTRY_CODES = [
  { code: '+1', name: 'República Dominicana', search: 'república dominicana dominicana rd', pattern: [3, 3, 4] },  // 10: 809 123 4567
  { code: '+57', name: 'Colombia', search: 'colombia', pattern: [3, 3, 4] },           // 10 dígitos: 300 123 4567
  { code: '+52', name: 'México', search: 'méxico mexico', pattern: [2, 4, 4] },       // 10: 55 1234 5678
  { code: '+54', name: 'Argentina', search: 'argentina', pattern: [2, 4, 4] },        // 10: 11 1234 5678
  { code: '+56', name: 'Chile', search: 'chile', pattern: [1, 4, 4] },                // 9: 9 1234 5678
  { code: '+51', name: 'Perú', search: 'peru perú', pattern: [3, 3, 3] },              // 9: 999 123 456
  { code: '+58', name: 'Venezuela', search: 'venezuela', pattern: [3, 3, 4] },         // 10: 412 123 4567
  { code: '+593', name: 'Ecuador', search: 'ecuador', pattern: [2, 3, 4] },          // 9: 99 123 4567
  { code: '+595', name: 'Paraguay', search: 'paraguay', pattern: [3, 3, 3] },         // 9: 981 123 456
  { code: '+598', name: 'Uruguay', search: 'uruguay', pattern: [4, 4] },              // 8: 9123 4567
  { code: '+591', name: 'Bolivia', search: 'bolivia', pattern: [3, 3, 3] },           // 9: 712 123 456
  { code: '+503', name: 'El Salvador', search: 'el salvador', pattern: [4, 4] },     // 8: 7123 4567
  { code: '+502', name: 'Guatemala', search: 'guatemala', pattern: [4, 4] },         // 8: 1234 5678
  { code: '+504', name: 'Honduras', search: 'honduras', pattern: [4, 4] },             // 8: 9123 4567
  { code: '+505', name: 'Nicaragua', search: 'nicaragua', pattern: [4, 4] },         // 8: 8123 4567
  { code: '+506', name: 'Costa Rica', search: 'costa rica', pattern: [4, 4] },       // 8: 8123 4567
  { code: '+507', name: 'Panamá', search: 'panama panamá', pattern: [4, 4] },        // 8: 6123 4567
  { code: '+55', name: 'Brasil', search: 'brasil brazil', pattern: [2, 5, 4] },       // 11: 11 91234 5678
  { code: '+1', name: 'Puerto Rico', search: 'puerto rico pr', pattern: [3, 3, 4] }, // 10: 787 123 4567
  { code: '+53', name: 'Cuba', search: 'cuba', pattern: [1, 3, 4] },                   // 8: 5 123 4567
  { code: '+1', name: 'Estados Unidos', search: 'estados unidos usa us', pattern: [3, 3, 4] }, // 10: 202 123 4567
  { code: '+1', name: 'Canadá', search: 'canadá canada ca', pattern: [3, 3, 4] },     // 10: 416 123 4567
];

const DEFAULT_PATTERN = [3, 3, 4];

export function getMaxDigits(pattern = DEFAULT_PATTERN) {
  return Array.isArray(pattern) ? pattern.reduce((a, b) => a + b, 0) : 15;
}

export function parsePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { code: COUNTRY_CODES[0].code, number: '' };
  }
  const trimmed = phone.trim();
  const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
  if (match) {
    const digits = (match[2] || '').replace(/\D/g, '');
    const country = COUNTRY_CODES.find((c) => c.code === match[1]);
    const number = formatPhoneNumber(digits, country?.pattern);
    return { code: match[1], number };
  }
  const digits = trimmed.replace(/\D/g, '');
  const number = formatPhoneNumber(digits, DEFAULT_PATTERN);
  return { code: COUNTRY_CODES[0].code, number };
}

export function formatPhoneNumber(digits, pattern = DEFAULT_PATTERN) {
  const d = (digits || '').replace(/\D/g, '');
  if (!d) return '';
  const parts = [];
  let i = 0;
  for (const len of pattern) {
    if (i >= d.length) break;
    parts.push(d.slice(i, i + len));
    i += len;
  }
  if (i < d.length) parts.push(d.slice(i));
  return parts.join(' ').trim();
}
