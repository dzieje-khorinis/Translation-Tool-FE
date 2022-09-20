module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off', // suppress errors for missing 'import React' in files
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // allow jsx syntax in js files (for next.js project)
    'jsx-a11y/click-events-have-key-events': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'jsx-a11y/no-static-element-interactions': 'off',
  },
};
