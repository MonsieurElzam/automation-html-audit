import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)
const run = (n, args = []) => spawnSync(process.execPath, [fileURLToPath(new URL(`../src/${n}.mjs`, import.meta.url)), ...args], { encoding: 'utf8' })
const samplePath = (n) => fileURLToPath(new URL(`../samples/${n}`, import.meta.url))

test('24 HTML : lang, title, description, h1, alt, liens', async () => {
  const { auditHtml } = await mod('html-audit')
  const issues = auditHtml(sample('page.html')).join(' | ')
  for (const part of ['lang', 'meta description', 'viewport', '2 balise(s) <h1>', 'alt', 'sans destination', 'noopener']) assert.ok(issues.includes(part), part)
  const good = '<!doctype html><html lang="fr"><head><title>Page</title><meta name="description" content="x"><meta name="viewport" content="width=device-width"></head><body><h1>Un</h1><img src="a.png" alt=""><a href="/x" target="_blank" rel="noopener">x</a><script>const a = "<img>"</script></body></html>'
  assert.deepEqual(auditHtml(good), [])
  assert.equal(run('html-audit', [samplePath('page.html')]).status, 2)
})
