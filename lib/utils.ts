import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  locale: string = "pt-MZ",
  currency: string = "MZN"
): string {
  // Formata o valor com Intl.NumberFormat
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  // Substitui "MTn" por "MZN" se necessário
  return formatted.replace("MTn", "MZN");
}

