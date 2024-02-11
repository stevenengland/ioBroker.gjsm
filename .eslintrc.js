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
    'plugin:@typescript-eslint/stylistic-type-checked', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: [],
  ignorePatterns: ['tools/**/*.js', 'admin/admin.d.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['classProperty'],
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off', // This is necessary for Map.has()/get()!
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
  },
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        // you should turn the original rule off *only* for test files
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-extraneous-class': ['error', { allowStaticOnly: true }],
      },
    },
  ],
};
