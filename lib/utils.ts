export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ");
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
  }
  return num.toString();
}

export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `$${price.toFixed(price < 1 ? 3 : 2)}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
