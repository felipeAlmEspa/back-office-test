export const normalizeDigits = (value: string) => {
  if (!value) return "";
  return value.replace(/\D+/g, "");
};

export const isEcuadorMobile = (phone: string) => {
  if (/[A-Za-z]/.test(phone)) return false;
  const digits = normalizeDigits(phone);
  if (!digits) return false;
  if (digits.length === 10 && digits.startsWith("09")) return true;
  if (digits.length === 12 && digits.startsWith("5939")) return true;

  return false;
};

export const isEcuadorFixedLine = (phone: string) => {
  if (/[A-Za-z]/.test(phone)) return false;
  const digits = normalizeDigits(phone);
  if (!digits) return false;
  if (digits.length !== 9) return false;
  const prefix = digits.substring(0, 2);
  const allowed = ["02", "03", "04", "05", "06", "07"];
  return allowed.includes(prefix);
};

export default isEcuadorMobile;
