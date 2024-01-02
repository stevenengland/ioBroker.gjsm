#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the new version: ', (newVersion) => {
  // Execute your script logic
  console.log('New version:', newVersion);
  console.log('Setting new version in package.json');
  processPackageJson(newVersion);
  console.log('Updating package-lock.json');
  updatePackageLockJson();
  console.log('Setting new version in io-package.json');
  processIoPackageJson(newVersion);
  console.log('Running npm run translate');
  runTranslateAdapter();

  rl.close();
});

function processPackageJson(newVersion) {
  const filePath = path.join(__dirname, 'package.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonContent = JSON.parse(fileContent);

  jsonContent.version = newVersion;

  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
}

function processIoPackageJson(newVersion) {
  const filePath = path.join(__dirname, 'io-package.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const jsonContent = JSON.parse(fileContent);

  jsonContent.common.version = newVersion;

  jsonContent.common.news = prependKey(jsonContent.common.news, newVersion, { en: 'test' });

  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
}

function prependKey(obj, newKey, value) {
  const ret = { [newKey]: value };
  for (const [k, v] of Object.entries(obj)) {
    ret[k] = v;
  }
  return ret;
}

function runTranslateAdapter() {
  runCommandSync('npm', ['run', 'translate']);
}

function updatePackageLockJson() {
  runCommandSync('npm', ['i', '--package-lock-only']);
}

function runCommandSync(command, args = []) {
  const child = spawnSync(command, args);
  if (child.status !== 0) {
    console.log('Error: ', child.error.toString('utf8'));
    console.log('Stderr: ', child.stderr.toString('utf8'));
  }
}
