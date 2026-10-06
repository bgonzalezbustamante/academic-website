import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

import ts from 'typescript'

const source = readFileSync(
  new URL('../lib/site-url.ts', import.meta.url),
  'utf8'
)
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText

function canIndex({
  url = 'https://bgonzalezbustamante.com',
  context = 'production',
  previewServer,
} = {}) {
  const exports = {}
  const env = {
    NEXT_PUBLIC_SITE_URL: url,
    SITE_DEPLOY_CONTEXT: context,
    NETLIFY_PREVIEW_SERVER: previewServer,
  }

  runInNewContext(compiled, {
    URL,
    exports,
    process: { env },
  })

  return exports.isProductionSiteUrl()
}

assert.equal(canIndex(), true, 'production must remain indexable')
assert.equal(
  canIndex({ url: 'https://www.bgonzalezbustamante.com' }),
  true,
  'the production www host must remain indexable'
)

for (const context of [
  'deploy-preview',
  'branch-deploy',
  'preview-server',
  'dev',
]) {
  assert.equal(
    canIndex({ context }),
    false,
    `${context} must not be indexed even with the production site URL`
  )
}

assert.equal(
  canIndex({ previewServer: 'true' }),
  false,
  'Netlify Preview Servers must not be indexed'
)
assert.equal(
  canIndex({ url: 'http://bgonzalezbustamante.com' }),
  false,
  'HTTP must not be indexed'
)
assert.equal(
  canIndex({ url: 'https://deploy-preview-11--bgonzalezbustamante.netlify.app' }),
  false,
  'preview hosts must not be indexed'
)
assert.equal(
  canIndex({ url: 'http://localhost:3000', context: undefined }),
  false,
  'localhost must not be indexed'
)

console.log('Site indexing checks passed')
