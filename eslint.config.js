import i18nextPlugin from 'eslint-plugin-i18next';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.tsx', 'src/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      i18next: i18nextPlugin,
    },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'ignore-attribute': ['className', 'style', 'type', 'id', 'src', 'href', 'rel', 'target', 'width', 'height', 'xmlns', 'viewBox', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'value', 'placeholder', 'path', 'to', 'alt', 'aria-label'],
        },
      ],
    },
  },
];
