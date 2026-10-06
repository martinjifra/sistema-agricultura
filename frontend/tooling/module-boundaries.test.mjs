import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Linter } from 'eslint'
import boundaries from './module-boundaries.mjs'

function lint(file, code) {
  return new Linter().verify(code, [{
    files: ['**/*.js'],
    plugins: { architecture: boundaries },
    rules: { 'architecture/module-boundaries': 'error' },
  }], { filename: fileURLToPath(new URL(`../src/${file}`, import.meta.url)) })
}

const forbidden = [
  ['modules/dashboard/Page.js', "import '@/modules/auth'", 'feature-to-feature alias'],
  ['modules/dashboard/Page.js', "import '../management/index'", 'feature-to-feature relative path'],
  ['modules/auth/Page.js', "import '@/app/router'", 'feature-to-app'],
  ['shared/ui/Card.js', "import '@/modules/dashboard'", 'shared-to-feature'],
  ['shared/ui/Card.js', "export * from '../../app/router'", 'shared-to-app re-export'],
  ['app/router.js', "import '@/modules/auth/pages/LoginPage'", 'app-to-private-feature'],
  ['app/router.js', "import('../modules/management/pages/ManagementPage')", 'dynamic private import'],
]

for (const [file, code, label] of forbidden) {
  test(`rejects ${label}`, () => {
    const messages = lint(file, code)
    assert.equal(messages.length, 1)
    assert.equal(messages[0].ruleId, 'architecture/module-boundaries')
    assert.equal(messages[0].severity, 2)
  })
}

const allowed = [
  ['modules/dashboard/Page.js', "import './components/Reading'", 'feature internal import'],
  ['modules/dashboard/Page.js', "import '@/shared/ui/Card'", 'feature-to-shared'],
  ['app/router.js', "import '@/modules/auth'", 'app-to-public-feature'],
  ['app/router.js', "export * from '../modules/management/index.ts'", 'public entry re-export'],
  ['shared/ui/Card.js', "import '../styles/tokens.css'", 'shared internal import'],
  ['modules/auth/Page.js', "import 'react'", 'external library'],
]

for (const [file, code, label] of allowed) {
  test(`allows ${label}`, () => assert.deepEqual(lint(file, code), []))
}
