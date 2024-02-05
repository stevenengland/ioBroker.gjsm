const { exit } = require('process');

const {
  getKeysFromIOPackage,
  getKeyFromAdapterConfigDTs,
  getLabelsFromJsonConfig,
  getKeysFromWords,
  getKeysFromEnTranslations,
  getKeysFromHtmlFiles,
  getItemsFromJsonConfig,
} = require('./utils/TranslationKeyCollector');

const { printRed, printGreen } = require('./utils/PrintHelper');

main();

function main() {
  const adapterConfigDTsKeys = getKeyFromAdapterConfigDTs();
  const ioPackageKeys = getKeysFromIOPackage();
  const labels = getLabelsFromJsonConfig();
  const items = getItemsFromJsonConfig();
  const words = getKeysFromWords();
  const enTranslations = getKeysFromEnTranslations();
  const htmlKeys = getKeysFromHtmlFiles();

  console.log('ADAPTER-CONFIG:  src/lib/adapter-config.d.ts');
  console.log(adapterConfigDTsKeys);
  checkForDuplicates(adapterConfigDTsKeys);
  console.log('IO-PACKAGE:      io-package.json');
  console.log(ioPackageKeys);
  checkForDuplicates(ioPackageKeys);
  console.log('JSON-LABELS:     admin/jsonConfig.json5');
  console.log(labels);
  checkForDuplicates(labels);
  console.log('JSON-ITEMS:      admin/jsonConfig.json5');
  console.log(items);
  checkForDuplicates(items);
  console.log('WORDS:           admin/words.js');
  console.log(words);
  checkForDuplicates(words);
  console.log('I18N-EN:         admin/i18n/en/translations.json');
  console.log(enTranslations);
  checkForDuplicates(enTranslations);
  console.log('HTML-KEYS:       admin/*.html');
  console.log(htmlKeys);
  checkForDuplicates(htmlKeys);

  let allItemsAreGood = [];
  console.log('Check equalty of WORDS and I18N-EN'); // Overall words and I18N-EN must be equal
  allItemsAreGood.push(compareArraysForEqualty(words, enTranslations));
  console.log('Check equalty of JSON-ITEMS and IO-PACKAGE'); // Config keys in jsonConfig must be equal to io-package config keys
  allItemsAreGood.push(compareArraysForEqualty(items, ioPackageKeys));
  console.log('Check equalty of ADAPTER-CONFIG and IO-PACKAGE'); // Config keys in adapter-config.d.ts must be equal to io-package config keys
  allItemsAreGood.push(compareArraysForEqualty(adapterConfigDTsKeys, ioPackageKeys));
  // console.log('Check if IO-PACKAGE are contained in I18N-EN');
  // allItemsAreGood.push(compareArraysForSub(ioPackageKeys, enTranslations));
  console.log('Check if JSON-LABELS are contained in I18N-EN');
  allItemsAreGood.push(compareArraysForSub(labels, enTranslations));
  console.log('Check if HTML-KEYS are contained in I18N-EN');
  allItemsAreGood.push(compareArraysForSub(htmlKeys, enTranslations));
  console.log('Check equalty of (JSON-LABELS + HTML-KEYS) and I18N-EN');
  allItemsAreGood.push(compareArraysForEqualty(labels.concat(htmlKeys), enTranslations));

  for (let i = 0; i < allItemsAreGood.length; i++) {
    if (!allItemsAreGood[i]) {
      printRed('Check failed');
      exit(1);
    }
  }
}

function checkForDuplicates(arr) {
  const duplicates = arr.filter((value, index, self) => self.indexOf(value) !== index);
  if (duplicates.length > 0) {
    printRed('Array contains duplicates', duplicates);
    exit(1);
  }
}

function compareArraysForEqualty(arr1, arr2) {
  const missingInArr2 = arr1.filter((item) => !arr2.includes(item));
  const missingInArr1 = arr2.filter((item) => !arr1.includes(item));
  let allItemsAreEqual = true;

  if (missingInArr2.length > 0) {
    printRed('Missing items in second array -->: ', missingInArr2);
    allItemsAreEqual = false;
  }

  if (missingInArr1.length > 0) {
    printRed('<-- Missing items in first array: ', missingInArr1);
    allItemsAreEqual = false;
  }
  if (allItemsAreEqual) {
    printGreen('All items are equal!');
  }

  return allItemsAreEqual;
}

function compareArraysForSub(arr1, arr2) {
  const missingInArr2 = arr1.filter((item) => !arr2.includes(item));
  let allItemsAreContained = true;

  if (missingInArr2.length > 0) {
    printRed('Missing items in second array -->: ', missingInArr2);
    allItemsAreContained = false;
  }

  if (allItemsAreContained) {
    printGreen('All items are contained!');
  }

  return allItemsAreContained;
}
