import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { departmentRecords } from "../local-pages/department-records.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "local-pages", "department-records.mjs");
const checkedAt = "2026-08-13";

const decode = (value) => String(value || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&apos;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, " ")
  .trim();

const number = (value) => {
  const parsed = Number(decode(value).replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(parsed)) throw new Error(`Nombre INSEE invalide: ${value}`);
  return parsed;
};

function rows(html, tableId) {
  const table = html.match(new RegExp(`<table[^>]+id=["']${tableId}["'][^>]*>([\\s\\S]*?)<\\/table>`, "i"))?.[1];
  if (!table) throw new Error(`Table ${tableId} absente`);
  return [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => {
    const cells = [...match[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map((cell) => decode(cell[1]));
    return { label: cells[0] || "", cells: cells.slice(1) };
  }).filter((item) => item.label && item.cells.length);
}

function row(tableRows, pattern) {
  const found = tableRows.find((item) => pattern.test(item.label));
  if (!found) throw new Error(`Ligne INSEE absente: ${pattern}`);
  return found;
}

function parseInsee(html) {
  const populationRows = rows(html, "produit-tableau-POP_T1");
  const housingTypeRows = rows(html, "produit-tableau-LOG_T3");
  const housingAgeRows = rows(html, "produit-tableau-LOG_T8");
  const tenureRows = rows(html, "produit-tableau-LOG_T10");
  const population = number(row(populationRows, /^Ensemble$/i).cells.at(-2));
  const age65to79 = number(row(populationRows, /65 à 79 ans/i).cells.at(-1));
  const age80 = number(row(populationRows, /80 ans ou plus/i).cells.at(-1));
  const houses = number(row(housingTypeRows, /^Maison$/i).cells.at(-1));
  const apartments = number(row(housingTypeRows, /^Appartement$/i).cells.at(-1));
  const owners = number(row(tenureRows, /^Propriétaire$/i).cells[5]);
  const housingBefore1919 = number(row(housingAgeRows, /^Avant 1919$/i).cells.at(-1));
  const housing1919to1945 = number(row(housingAgeRows, /1919 à 1945/i).cells.at(-1));
  const housing1946to1970 = number(row(housingAgeRows, /1946 à 1970/i).cells.at(-1));
  return {
    dataYear: 2023,
    population,
    age65to79,
    age80,
    age65: Math.round((age65to79 + age80) * 10) / 10,
    houses,
    apartments,
    owners,
    housingBefore1919,
    housing1919to1945,
    housing1946to1970,
    pre1971: Math.round((housingBefore1919 + housing1919to1945 + housing1946to1970) * 10) / 10
  };
}

async function get(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "GoSeniorEditorialData/1.0" },
        signal: AbortSignal.timeout(25000)
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.text();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
    }
  }
  throw lastError;
}

const records = structuredClone(departmentRecords);
const missing = records.flatMap((record) => record.topCommunes
  .filter((commune) => !commune.statistics && record.code !== "976")
  .map((commune) => ({ record, commune })));

let cursor = 0;
let recovered = 0;
async function worker() {
  while (cursor < missing.length) {
    const item = missing[cursor];
    cursor += 1;
    try {
      const html = await get(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${item.commune.inseeCode}`);
      item.commune.statistics = parseInsee(html);
      recovered += 1;
    } catch (error) {
      process.stderr.write(`Indisponible: ${item.commune.name} (${item.commune.inseeCode}) — ${error.message}\n`);
    }
    process.stdout.write(`\rRécupération communale: ${cursor}/${missing.length}`);
  }
}

await Promise.all(Array.from({ length: 3 }, worker));
process.stdout.write("\n");
await writeFile(
  output,
  `// Snapshot généré depuis l'API Géo et les dossiers départementaux INSEE.\n// Sources vérifiées le ${checkedAt}. Régénérer avec: npm run data:departments\nexport const departmentRecords = Object.freeze(${JSON.stringify(records, null, 2)});\n`
);
console.log(`Récupérées: ${recovered}/${missing.length}. Snapshot mis à jour.`);
