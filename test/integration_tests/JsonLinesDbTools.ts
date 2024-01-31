import * as fs from 'fs';

interface JsonEntry {
  k: string;
  v: unknown;
}

export function readJsonlFile(filePath: string): Map<string, unknown> | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    const lines: string[] = fileContent.split('\n');
    let currentLine = 0;

    const resultMap = new Map<string, unknown>();

    lines.forEach((line: string) => {
      currentLine++;
      if (line.trim() !== '') {
        try {
          const jsonData: JsonEntry = JSON.parse(line) as JsonEntry;
          if (jsonData.k && jsonData.v) {
            resultMap.set(jsonData.k, jsonData.v);
          }
        } catch (error) {
          console.error(`Error parsing JSON at line ${currentLine}:`, (error as Error).message);
        }
      }
    });

    return resultMap;
  } catch (error) {
    console.error('Error reading file:', (error as Error).message);
    return null;
  }
}

export function addEntryToMap(map: Map<string, unknown>, key: string, payload: unknown): void {
  map.set(key, payload);
}

export function writeMapToJsonlFile(filePath: string, map: Map<string, unknown>): void {
  try {
    const lines: string[] = [];

    map.forEach((payload: unknown, key: string) => {
      const entry: JsonEntry = { k: key, v: payload };
      lines.push(JSON.stringify(entry));
    });

    const fileContent: string = lines.join('\n');
    fs.writeFileSync(filePath, fileContent, 'utf-8');
  } catch (error) {
    console.error('Error writing to file:', (error as Error).message);
  }
}
