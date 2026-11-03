const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const localeDirectory = path.join(root, "i18n", "locales");
const languages = ["en", "id", "zh", "ja", "vi"];
const namespaces = ["app", "sidebar"];
const keyMap = JSON.parse(fs.readFileSync(path.join(root, "i18n", "keys.json"), "utf8"));
const reference = JSON.parse(fs.readFileSync(path.join(localeDirectory, "en.json"), "utf8"));
let failed = false;

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

for (const sourcePath of ["app/page.jsx", "app/components/MarketTradingChart.jsx"]) {
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
