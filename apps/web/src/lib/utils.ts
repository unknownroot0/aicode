import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProductImageUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  const relativePath = path.startsWith("/") ? path : `/${path}`;
  
  return `${baseUrl}${relativePath}`;
}
