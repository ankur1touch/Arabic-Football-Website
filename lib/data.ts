import { readFileSync } from "fs";
import path from "path";

export function readJsonData<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}
