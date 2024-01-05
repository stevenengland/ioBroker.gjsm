module.exports = {
  root: true, // Don't look outside this project for inherited configs
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json',
  },
  extends: [
    'plugin:@typescript-eslint/strict-type-checked', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [],
  rules: {
    '@typescript-eslint/naming-convention': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off', // This is necessary for Map.has()/get()!
    '@typescript-eslint/explicit-member-accessibility': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
      },
    },
  ],
};
