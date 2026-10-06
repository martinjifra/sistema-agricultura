import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import boundaries from './tooling/module-boundaries.mjs'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { document: 'readonly' } },
    plugins: { architecture: boundaries },
    rules: { 'architecture/module-boundaries': 'error' },
  },
]
