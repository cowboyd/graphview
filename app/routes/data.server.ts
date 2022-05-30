import { readFile } from "fs/promises";

export async function loadData(): Promise<string> {
  let graph = await readFile("graph.json");
  return String(graph);
}
