import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

export const formatNumber = (number: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

export const formatPercent = (value: number) => {
  if (!isFinite(value)) {
    return "+999";
  }

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  if (value > 0) {
    return `+${formatted}`;
  }

  return formatted;
};

export function generateObjectId(tableName: "customers" | "sales") {
  function generateRandomString(length: number) {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    );

    return randomArray.join("");
  }

  const prefix = tableName.slice(0, 3).toLowerCase();
  return `${prefix}_${generateRandomString(8)}`;
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
