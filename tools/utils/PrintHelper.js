function printGreen(...args) {
  console.log('\x1b[32m', ...args, '\x1b[0m');
}

function printRed(...args) {
  console.log('\x1b[31m', ...args, '\x1b[0m');
}

module.exports = { printGreen, printRed };
