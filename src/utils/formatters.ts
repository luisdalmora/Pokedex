export function formatId(id: number): string {
  return `#${id.toString().padStart(4, "0")}`;
}

export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`;
}

export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)} m`;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

export function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r]/g, " ").replace(/\s+/g, " ").trim();
}
