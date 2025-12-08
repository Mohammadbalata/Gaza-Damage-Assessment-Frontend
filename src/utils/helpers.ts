export const generateTrackingNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `GAZA-${year}-${random}`;
};

export const generatePassword = (): string => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*";

  const getRandomChar = (str: string) =>
    str[Math.floor(Math.random() * str.length)];

  let password = "";
  password += getRandomChar(uppercase);
  password += getRandomChar(uppercase);
  password += getRandomChar(uppercase);
  password += getRandomChar(lowercase);
  password += getRandomChar(lowercase);
  password += getRandomChar(lowercase);
  password += getRandomChar(digits);
  password += getRandomChar(digits);
  password += getRandomChar(digits);
  password += getRandomChar(symbols);
  password += getRandomChar(symbols);
  password += getRandomChar(symbols);

  // Shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
