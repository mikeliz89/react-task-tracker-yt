// compare-json.js
// Käyttö: node compare-json.js <lähde.json> <kohde.json>
// Käyttöesimerkki: node compare-json.js locales/fi/tasklist.json locales/en/tasklist.json
// Tulostaa avaimet, jotka puuttuvat kohteesta verrattuna lähteeseen.

const fs = require("fs");

function load(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function collectLeafPaths(obj, prefix = "") {
  const out = [];
  if (!isPlainObject(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v)) {
      out.push(...collectLeafPaths(v, next));
    } else if (Array.isArray(v)) {
      // Jos taulukossa on objekteja, käydään sisään; muuten käsitellään lehtenä
      v.forEach((item, i) => {
        if (isPlainObject(item)) out.push(...collectLeafPaths(item, `${next}.${i}`));
        else out.push(`${next}.${i}`);
      });
    } else {
      out.push(next);
    }
  }
  return out;
}
function missingKeys(fromObj, toObj) {
  const A = new Set(collectLeafPaths(fromObj));
  const B = new Set(collectLeafPaths(toObj));
  return [...A].filter(k => !B.has(k)).sort();
}

(function main() {
  const [,, src, dst] = process.argv;
  if (!src || !dst) {
    console.error("Usage: node compare-json.js <source.json> <target.json>");
    process.exit(2);
  }
  const srcJson = load(src);
  const dstJson = load(dst);
  const missing = missingKeys(srcJson, dstJson);

  if (missing.length === 0) {
    console.log(`✅ Ei puuttuvia avaimia: ${dst}`);
    return;
  }
  console.log(`❌ Puuttuu kohteesta ${dst} (verrattuna ${src}): ${missing.length} kpl`);
  missing.forEach(k => console.log(k));
  process.exitCode = 1; // Hyödyllinen CI:lle
})();