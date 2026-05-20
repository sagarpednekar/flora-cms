import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const apiUrl = import.meta.env.VITE_API_URL || "";

export function scrollToFormSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToElement(elementId: string) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "end" });
}

/** Title-case each word for table headers (handles spaces, slashes, parentheses). */
export function titleCaseLabel(label: string): string {
  return label
    .split(/(\s+|\/|\(|\))/)
    .map((part) => {
      if (!part || /^[\s/()]+$/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}
