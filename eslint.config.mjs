import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
export default ts.config(
  {
    ignores: [
      'dist/**',
      'dist-static/**',
      '.astro/**',
      '.wrangler/**',
      'node_modules/**',
      'output/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  { files: ['**/*.mjs'], languageOptions: { globals: { process: 'readonly' } } },
);
