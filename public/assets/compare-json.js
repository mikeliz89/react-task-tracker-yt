// compare-json.js
// Käyttö: node compare-json.js <lähde.json> <kohde.json> [--add-missing] [--use-source-value]
// Käyttöesimerkki: node compare-json.js locales/fi/tasklist.json locales/en/tasklist.json --add-missing --use-source-value
// Tulostaa avaimet, jotka puuttuvat kohteesta verrattuna lähteeseen.
// --add-missing lisää puuttuvat avaimet kohteeseen ja tallentaa tiedostoon <kohde>.with-missing.json
// --use-source-value täyttää puuttuvat avaimet lähteen arvoilla (oletuksena tyhjä merkkijono)

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
function getValueByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}
function setValueByPath(obj, path, value) {
  const keys = path.split('.');
  let o = obj;
  for (let i = 0; i < keys.length - 1; ++i) {
    const k = keys[i];
    if (!(k in o) || typeof o[k] !== "object") {
      // Luo objekti tai taulukko tarpeen mukaan
      if (/^\d+$/.test(keys[i + 1])) o[k] = [];
      else o[k] = {};
    }
    o = o[k];
  }
  o[keys[keys.length - 1]] = value;
}
function missingKeys(fromObj, toObj) {
  const A = new Set(collectLeafPaths(fromObj));
  const B = new Set(collectLeafPaths(toObj));
  return [...A].filter(k => !B.has(k)).sort();
}

// Lisää puuttuvat avaimet kohdeobjektiin (arvoksi tyhjä merkkijono tai lähteen arvo)
function addMissingKeys(fromObj, toObj, useSourceValue = false) {
  const missing = missingKeys(fromObj, toObj);
  missing.forEach(path => {
    const value = useSourceValue ? getValueByPath(fromObj, path) : "";
    setValueByPath(toObj, path, value);
  });
  return toObj;
}

(function main() {
  const [,, src, dst, ...rest] = process.argv;
  const addMissing = rest.includes("--add-missing");
  const useSourceValue = rest.includes("--use-source-value");
  if (!src || !dst) {
    console.error("Usage: node compare-json.js <source.json> <target.json> [--add-missing] [--use-source-value]");
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

  if (addMissing) {
    const newObj = addMissingKeys(srcJson, JSON.parse(JSON.stringify(dstJson)), useSourceValue);
    const outPath = dst.replace(/\.json$/i, "") + ".with-missing.json";
    fs.writeFileSync(outPath, JSON.stringify(newObj, null, 2), "utf8");
    console.log(`\nLisätty puuttuvat avaimet tiedostoon: ${outPath}`);
  }

  process.exitCode = 1;
})();