import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import prettier from "prettier";

const mode = process.argv.includes("--check") ? "check" : "write";
const root = process.cwd();
const voidElements = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];
const voidElementPattern = new RegExp(`<(${voidElements.join("|")})(\\b[^<>]*?)\\s*/>`, "gi");

function normalizeHtml(html) {
  return html
    .replace(/^<!doctype html>/i, "<!DOCTYPE html>")
    .replace(voidElementPattern, "<$1$2>")
    .replace(/<\/head>\n+(?:[ \t]*\n)*( *)(<body>)/, "</head>\n\n$1$2")
    .replace(/(<canvas\b[^>]*><\/canvas>)\n+(?:[ \t]*\n)*( *)(<script\b)/g, "$1\n\n$2$3")
    .replace(/[ \t]+$/gm, "");
}

async function getHtmlFiles() {
  const entries = await fs.readdir(root);

  return entries.filter((entry) => entry.endsWith(".html")).sort();
}

async function getExpectedHtml(file) {
  const source = await fs.readFile(file, "utf8");
  const options = (await prettier.resolveConfig(file)) ?? {};
  const formatted = await prettier.format(source, { ...options, filepath: file });

  return normalizeHtml(formatted);
}

let hasMismatch = false;

for (const fileName of await getHtmlFiles()) {
  const file = path.join(root, fileName);
  const source = await fs.readFile(file, "utf8");
  const expected = await getExpectedHtml(file);

  if (source === expected) continue;

  if (mode === "check") {
    hasMismatch = true;
    console.error(`${fileName} is not formatted with the project HTML style.`);
    continue;
  }

  await fs.writeFile(file, expected);
  console.log(`${fileName} formatted`);
}

if (hasMismatch) {
  process.exitCode = 1;
}
