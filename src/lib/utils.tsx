import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines conditional class names + merges Tailwind duplicates safely
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
