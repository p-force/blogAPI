module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'class-methods-use-this': 0,
    'no-console': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
  },
};
