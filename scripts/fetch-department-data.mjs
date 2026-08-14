import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "local-pages", "department-records.mjs");
const checkedAt = "2026-08-12";

const decode = (value) => String(value || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&apos;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, " ")
  .trim();

const number = (value) => {
  const normalized = decode(value).replace(/\s/g, "").replace(",", ".");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) throw new Error(`Nombre INSEE invalide: ${value}`);
  return parsed;
};

function rows(html, tableId) {
  const table = html.match(new RegExp(`<table[^>]+id=["']${tableId}["'][^>]*>([\\s\\S]*?)<\\/table>`, "i"))?.[1];
  if (!table) throw new Error(`Table ${tableId} absente`);
  return [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => {
    const cells = [...match[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map((cell) => decode(cell[1]));
    return { label: cells[0] || "", cells: cells.slice(1) };
  }).filter((row) => row.label && row.cells.length);
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

async function get(url, kind = "json", attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "GoSeniorEditorialData/1.0" },
        signal: AbortSignal.timeout(25000)
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return kind === "text" ? response.text() : response.json();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }
  throw new Error(`${url}: ${lastError?.message || "échec"}`);
}

async function mapLimit(items, limit, operation) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await operation(items[index], index);
      process.stdout.write(`\rDonnées officielles: ${results.filter(Boolean).length}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  process.stdout.write("\n");
  return results;
}

const [departments, regions] = await Promise.all([
  get("https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion"),
  get("https://geo.api.gouv.fr/regions?fields=nom,code")
]);
const regionNames = new Map(regions.map((region) => [region.code, region.nom]));

const records = await mapLimit(
  departments.sort((a, b) => a.code.localeCompare(b.code, "fr", { numeric: true })),
  8,
  async (department) => {
    const communes = await get(`https://geo.api.gouv.fr/communes?codeDepartement=${encodeURIComponent(department.code)}&fields=nom,code,population,codesPostaux&format=json`);
    const topCommuneSummaries = communes
      .filter((commune) => Number.isFinite(commune.population))
      .sort((a, b) => b.population - a.population)
      .slice(0, 5)
      .map((commune) => ({
        name: commune.nom,
        inseeCode: commune.code,
        population: commune.population,
        postalCode: commune.codesPostaux?.[0] || ""
      }));
    const topCommunes = await Promise.all(topCommuneSummaries.map(async (commune) => {
      if (department.code === "976") return commune;
      try {
        const cityHtml = await get(`https://www.insee.fr/fr/statistiques/2011101?geo=COM-${commune.inseeCode}`, "text");
        return { ...commune, statistics: parseInsee(cityHtml) };
      } catch (error) {
        process.stderr.write(`\nDonnées communales indisponibles pour ${commune.name} (${commune.inseeCode}): ${error.message}\n`);
        return { ...commune, statistics: null };
      }
    }));
    if (department.code === "976") {
      return {
        code: department.code,
        name: department.nom,
        regionName: regionNames.get(department.codeRegion),
        topCommunes,
        specialSource: "mayotte-2017-2026",
        dataYear: 2017,
        population: 323153,
        populationYear: 2026,
        age65: 2.7,
        mainResidences: 63100,
        owners: 53,
        precariousHousing: 39
      };
    }
    const html = await get(`https://www.insee.fr/fr/statistiques/2011101?geo=DEP-${department.code}`, "text");
    return {
      code: department.code,
      name: department.nom,
      regionName: regionNames.get(department.codeRegion),
      topCommunes,
      ...parseInsee(html)
    };
  }
);

await mkdir(path.dirname(output), { recursive: true });
await writeFile(
  output,
  `// Snapshot généré depuis l'API Géo et les dossiers départementaux INSEE.\n// Sources vérifiées le ${checkedAt}. Régénérer avec: npm run data:departments\nexport const departmentRecords = Object.freeze(${JSON.stringify(records, null, 2)});\n`
);
console.log(`Écrit: ${output} (${records.length} départements)`);
