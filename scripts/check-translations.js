const fs = require("node:fs");
const path = require("node:path");

const localeDirectory = path.join(process.cwd(), "i18n", "locales");
const languages = ["en", "id", "zh", "ja", "vi"];
const load = (language) => JSON.parse(fs.readFileSync(path.join(localeDirectory, language + ".json"), "utf8"));
const reference = load("en");
const namespaces = ["app", "sidebar"];
let failed = false;

for (const language of languages) {
  const locale = load(language);
  for (const namespace of namespaces) {
    const expected = Object.keys(reference[namespace] || {});
    const actual = locale[namespace] || {};
    const missing = expected.filter((key) => !(key in actual));
    const extra = Object.keys(actual).filter((key) => !(key in (reference[namespace] || {})));
    if (missing.length || extra.length) {
      failed = true;
      process.stderr.write(language + "/" + namespace + ": missing [" + missing.join(", ") + "], extra [" + extra.join(", ") + "]\\n");
    }
  }
}

if (failed) process.exit(1);
process.stdout.write("All locale namespaces contain matching keys for: " + languages.join(", ") + "\\n");
