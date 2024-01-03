#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { type } = require('os');
const { exit } = require('process');

let newVersion = '';
let error = false;
let errorText = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function Do(func1, args, message) {
  console.log('> ' + message);

  if (!func1(args)) {
    console.log('Done');
  } else {
    console.log('Error: ' + errorText);
    process.exit(1);
  }
}

function isSemanticVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}

function checkBranch() {
  let result = handleCommandResponse(runCommandSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']));
  if (!error && result === 'main') {
    error = true;
    errorText = 'The branch is main. Please switch to a pr-branch first.';
  }
  return error;
}

function checkCommittableFiles() {
  let result = handleCommandResponse(runCommandSync('git', ['status', '--porcelain']));
  if (!error && result !== '') {
    error = true;
    errorText = 'There are uncommitted changes. Please commit or stash them first.';
  }
  return error;
}

function processPackageJson(newVersion) {
  let filePath = path.join(__dirname, 'package.json');
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let jsonContent = JSON.parse(fileContent);

  jsonContent.version = newVersion;
  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));

  // Check success
  fileContent = fs.readFileSync(filePath, 'utf8');
  jsonContent = JSON.parse(fileContent);

  if (jsonContent.version !== newVersion) {
    error = true;
    errorText = 'Could not set new version in package.json - Old: ' + jsonContent.version + ' New: ' + newVersion;
  }

  return error;
}

function processPackageLockJson() {
  handleCommandResponse(runCommandSync('npm', ['i', '--package-lock-only']));
  return error;
}

function processIoPackageJson(newVersion) {
  let filePath = path.join(__dirname, 'io-package.json');
  let fileContent = fs.readFileSync(filePath, 'utf8');
  let jsonContent = JSON.parse(fileContent);

  let newsFilePath = path.join(__dirname, 'news.txt');
  let newsFileContent = '';
  let askForNews = false;
  if (fs.existsSync(newsFilePath)) {
    newsFileContent = fs.readFileSync(newsFilePath, 'utf8');
    if (newsFileContent.length === 0) {
      console.log('The news file is empty.');
      askForNews = true;
    } else {
      console.log('The news.txt file contains the following content:');
      console.log(newsFileContent);
      let doUpdateNews = ask('Do you want to use these news? [Y/N] ');
      if (doUpdateNews.toUpperCase() !== 'Y') {
        askForNews = true;
      }
    }
  } else {
    console.log('A news.txt file does not exist.');
    askForNews = true;
  }

  if (askForNews) {
    error = true;
    errorText = 'Please provide a news.txt file with suitable content first.';
    return error;
  }

  newsFileContent = newsFileContent.replace(/\r\n/g, '\n');

  jsonContent.common.version = newVersion;

  jsonContent.common.news = prependKey(jsonContent.common.news, newVersion, { en: newsFileContent });
  jsonContent.common.news = limitKeys(jsonContent.common.news, 5);

  fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));

  // Check success
  fileContent = fs.readFileSync(filePath, 'utf8');
  jsonContent = JSON.parse(fileContent);
  if (jsonContent.common.version !== newVersion) {
    error = true;
    errorText =
      'Could not set new version in io-package.json - Old: ' + jsonContent.common.version + ' New: ' + newVersion;
  }

  if (Object.entries(jsonContent.common.news).length >= 5) {
    error = true;
    errorText =
      'Could not limit news in io-package.json - News length: ' + Object.entries(jsonContent.common.news).length;
  }

  if (Object.entries(jsonContent.common.news)[0][0] !== newVersion) {
    error = true;
    errorText = 'Could not prepend news in io-package.json - News: ' + Object.entries(jsonContent.common.news)[0][0];
  }

  return error;
}

function runTranslateAdapter() {
  handleCommandResponse(runCommandSync('npm', ['run', 'translate']));
  return error;
}

function commitChanges() {
  handleCommandResponse(runCommandSync('git', ['add', '.']));
  if (error) {
    return error;
  }
  handleCommandResponse(runCommandSync('git', ['commit', '-m', 'chore: Bump version to: v' + newVersion]));
  return error;
}

function prependKey(obj, newKey, value) {
  const ret = { [newKey]: value };
  for (const [k, v] of Object.entries(obj)) {
    ret[k] = v;
  }
  return ret;
}

function limitKeys(obj, count) {
  const ret = {};
  for (const [k, v] of Object.entries(obj).slice(0, count)) {
    ret[k] = v;
  }
  return ret;
}

function runCommandSync(command, args = []) {
  const child = spawnSync(command, args);
  return [child.status, child.stdout.toString('utf8'), child.stderr.toString('utf8')];
}

function handleCommandResponse(response) {
  if (response[0] !== 0) {
    error = true;
    errorText = response[2];
  }
  return response[1];
}

function ask(message) {
  var stdin = process.platform === 'win32' ? process.stdin.fd : fs.openSync('/dev/tty', 'rs');
  fs.writeSync(process.stdout.fd, message + ' ');
  let s = '';
  let buf = Buffer.alloc(1);
  fs.readSync(stdin, buf, 0, 1, null);
  while (buf[0] != 10 && buf[0] != 13) {
    s += buf;
    fs.writeSync(process.stdout.fd, buf);
    fs.readSync(stdin, buf, 0, 1, null);
  }
  fs.writeSync(process.stdout.fd, '\n');
  return s;
}

// Logic
newVersion = ask('Please enter the new version: ');
if (!isSemanticVersion(newVersion)) {
  console.log('Error: The version is not a semantic version.');
  process.exit(1);
}
console.log('Using version:', newVersion);
Do(checkBranch, [], 'Checking branch');
Do(checkCommittableFiles, [], 'Checking committable files');
Do(processIoPackageJson, newVersion, 'Setting new version in io-package.json');
Do(processPackageJson, newVersion, 'Setting new version in package.json');
Do(processPackageLockJson, [], 'Updating package-lock.json');
Do(runTranslateAdapter, [], 'Running Translate adapter');
let doCommit = ask('Please check the changes. Shall these be committed? [Y/N] ');
if (doCommit.toUpperCase() !== 'Y') {
  console.log('Aborting commit');
  process.exit(0);
}
Do(commitChanges, [], 'Committing changes');
exit(0);
