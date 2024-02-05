const JSON5 = require('json5');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function getKeyFromAdapterConfigDTs() {
  const fileContent = fs.readFileSync('src/lib/adapter-config.d.ts', 'utf8');
  // Extract the content of the variable "state"
  const regex = /interface AdapterConfig (\{.*?\})/s;
  const match = fileContent.match(regex);
  const keysObject = match ? match[1] : null;
  if (!keysObject) {
    return [];
  }
  return keysObject.match(/([a-zA-Z0-9]+):.*?;/g).map((key) => key.split(':')[0]);
}

function getKeysFromIOPackage() {
  const fileContent = fs.readFileSync('io-package.json', 'utf8');
  const ioPackage = JSON.parse(fileContent);
  const nativeKeys = Object.keys(ioPackage.native);
  return nativeKeys;
}

function getLabelsFromJsonConfig() {
  const fileContent = fs.readFileSync('admin/jsonConfig.json5', 'utf8');
  const jsonConfig = JSON5.parse(fileContent);
  const labels = [];

  function scanObject(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        scanObject(obj[key]);
      } else if (key === 'label') {
        labels.push(obj[key]);
      }
    }
  }

  scanObject(jsonConfig);
  return labels;
}

function getItemsFromJsonConfig() {
  const fileContent = fs.readFileSync('admin/jsonConfig.json5', 'utf8');
  const jsonConfig = JSON5.parse(fileContent);
  const panels = [];
  const items = [];

  function scanObject(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (obj[key].type && obj[key].type === 'panel') {
          panels.push(obj[key]);
        }
        scanObject(obj[key]);
      }
    }
  }

  scanObject(jsonConfig);
  panels.forEach((panel) => {
    items.push(Object.keys(panel.items).filter((item) => !item.startsWith('_')));
  });

  return items.flat();
}

function getKeysFromWords() {
  const fileContent = fs.readFileSync('admin/words.js', 'utf8');
  const regex = /systemDictionary = \s*(\{.*?\});/s;
  const match = fileContent.match(regex);
  const keysObject = match ? match[1] : null;
  if (!keysObject) {
    return [];
  }
  return Object.keys(eval(`(${keysObject})`));
}

function getKeysFromEnTranslations() {
  const fileContent = fs.readFileSync('admin/i18n/en/translations.json', 'utf8');
  const translations = JSON.parse(fileContent);
  const keys = Object.keys(translations);
  return keys;
}

function getKeysFromHtmlFiles() {
  const directory = 'admin';
  const htmlFiles = fs.readdirSync(directory).filter((file) => file.endsWith('.html'));
  const translationsKeys = [];

  htmlFiles.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(fileContent);

    $('.translate').each((index, element) => {
      const text = $(element).text().trim();
      translationsKeys.push(text);
    });
  });

  return translationsKeys;
}

module.exports = {
  getKeyFromAdapterConfigDTs,
  getKeysFromIOPackage,
  getLabelsFromJsonConfig,
  getKeysFromWords,
  getKeysFromEnTranslations,
  getKeysFromHtmlFiles,
  getItemsFromJsonConfig,
};
