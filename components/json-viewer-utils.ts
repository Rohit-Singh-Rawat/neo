export type JsonValueKind = "string" | "number" | "boolean" | "null" | "array" | "object";

export function classifyJsonValue(value: unknown): JsonValueKind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

export const jsonValueClassName: Record<JsonValueKind, string> = {
  string: "text-success",
  number: "text-running",
  boolean: "text-running",
  null: "text-muted-foreground italic",
  array: "text-foreground",
  object: "text-foreground",
};
