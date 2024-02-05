const glob = require('glob');
const fs = require('fs');
const { execSync } = require('child_process');

main();

function main() {
  console.log('Deleting words.js');
  if (fs.existsSync('admin/words.js')) {
    fs.rmSync('admin/words.js');
  }

  console.log('Cleaning translation keys that are not present in the master translation file');
  const masterTranslationFile = 'admin/i18n/en/translations.json';
  const masterTranslationKeys = Object.keys(getKeyValuesFromTranslationFile(masterTranslationFile));

  const translationFiles = detectTranslationFiles();
  for (const file of translationFiles) {
    let translations = getKeyValuesFromTranslationFile(file);

    for (const key in translations) {
      if (!masterTranslationKeys.includes(key)) {
        console.log(`Removing key "${key}" from file "${file}"`);
        delete translations[key];
      }
    }

    fs.writeFileSync(file, JSON.stringify(translations, null, 4));
  }

  // Restore words.js at the end, when all translations are cleaned
  console.log('Running translate script to update words.js');
  const stdout = execSync('npx translate-adapter w').toString();
  console.log(stdout);
}

function detectTranslationFiles() {
  const directory = 'admin/i18n';
  const pattern = `${directory}/**/*.json`;

  const jsonFiles = glob.sync(pattern);

  return jsonFiles;
}

function getKeyValuesFromTranslationFile(file) {
  const fileContent = fs.readFileSync(file, 'utf8');
  const translations = JSON.parse(fileContent);
  return translations;
}
