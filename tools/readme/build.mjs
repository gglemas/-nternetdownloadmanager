import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

function fill(name, body) {
  const readme = path.join(root, "README.md");
  const text = fs.readFileSync(readme, "utf8");
  const start = `<!-- ${name}:start -->`, end = `<!-- ${name}:end -->`;
  const a = text.indexOf(start), b = text.indexOf(end);
  if (a < 0 || b < a) throw new Error(`README.md has no ${name} markers`);
  fs.writeFileSync(readme, text.slice(0, a) + `${start}\n${body}\n` + text.slice(b));
}

function languageRow() {
  const lines = fs.readFileSync(path.join(root, "i18n/languages.tsv"), "utf8").split("\n");
  const header = lines.find((line) => line.startsWith("# code\t")).slice(2).split("\t");
  const rows = lines.filter((line) => line.trim() && !line.startsWith("#")).map((line) => {
    const columns = line.split("\t");
    return Object.fromEntries(header.map((key, index) => [key, columns[index]]));
  });
  rows.sort((a, b) => a.english.localeCompare(b.english));
  const attr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const flags = rows.map((row) => {
    const name = row.native === row.english ? row.english : `${row.native} (${row.english})`;
    return `<img src="crates/app/assets/flags/${row.flag}.svg" width="28" height="21" alt="${attr(name)}" title="${attr(name)}">`;
  });
  fill("languages", `<p align="center">\n${flags.join("\n")}\n</p>`);
  return rows.length;
}

console.log(`wrote README.md's language row (${languageRow()} languages)`);
