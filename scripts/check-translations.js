const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const localeDirectory = path.join(root, "i18n", "locales");
const languages = ["en", "id", "zh", "ja", "vi"];
const namespaces = ["app", "sidebar"];
const keyMap = JSON.parse(fs.readFileSync(path.join(root, "i18n", "keys.json"), "utf8"));
const reference = JSON.parse(fs.readFileSync(path.join(localeDirectory, "en.json"), "utf8"));
let failed = false;

const mappedKeys = Object.values(keyMap);
const duplicateMappedKeys = mappedKeys.filter((key, index) => mappedKeys.indexOf(key) !== index);
if (duplicateMappedKeys.length) {
  failed = true;
  process.stderr.write("Duplicate stable translation IDs: " + [...new Set(duplicateMappedKeys)].join(", ") + "\n");
}
for (const [sourceText, stableKey] of Object.entries(keyMap)) {
  if (!(stableKey in (reference.app || {}))) {
    failed = true;
    process.stderr.write("Missing English locale entry for " + sourceText + " (" + stableKey + ")\n");
  }
}

for (const language of languages) {
  const locale = JSON.parse(fs.readFileSync(path.join(localeDirectory, language + ".json"), "utf8"));
  for (const namespace of namespaces) {
    const expected = Object.keys(reference[namespace] || {});
    const actual = locale[namespace] || {};
    const missing = expected.filter((key) => !(key in actual));
    const extra = Object.keys(actual).filter((key) => !(key in (reference[namespace] || {})));
    if (missing.length || extra.length) {
      failed = true;
      process.stderr.write(language + "/" + namespace + ": missing [" + missing.join(", ") + "], extra [" + extra.join(", ") + "]\n");
    }
  }
}

for (const sourcePath of ["features/app/BeananceApp.jsx", "features/market/components/MarketTradingChart.jsx"]) {
  const source = fs.readFileSync(path.join(root, sourcePath), "utf8");
  for (const match of source.matchAll(/\bt\("([^"]+)"\)/g)) {
    if (!(match[1] in keyMap)) {
      failed = true;
      process.stderr.write(sourcePath + ": untranslated key " + JSON.stringify(match[1]) + "\n");
    }
  }
}

if (failed) process.exit(1);
process.stdout.write("All locale keys are present in: " + languages.join(", ") + "\n");
