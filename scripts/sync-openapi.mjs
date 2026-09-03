import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_SCHEMA_URL =
  'https://donworry-api-61976702501.asia-northeast3.run.app/api-docs.json'
const schemaUrl = process.env.OPENAPI_SCHEMA_URL ?? DEFAULT_SCHEMA_URL
const schemaPath = path.resolve('openapi/openapi.json')
const checkOnly = process.argv.includes('--check')

const response = await fetch(schemaUrl)

if (!response.ok) {
  throw new Error(`OpenAPI 명세 조회 실패: ${response.status} ${response.statusText}`)
}

const schema = await response.json()
const nextSnapshot = `${JSON.stringify(schema, null, 2)}\n`

if (checkOnly) {
  const currentSnapshot = await readFile(schemaPath, 'utf8').catch(() => '')

  if (currentSnapshot !== nextSnapshot) {
    console.error(
      '배포된 OpenAPI 명세가 저장된 스냅샷과 다릅니다. npm run api:sync && npm run api:generate 후 변경을 검토하세요.',
    )
    process.exitCode = 1
  } else {
    console.log('배포된 OpenAPI 명세와 저장된 스냅샷이 일치합니다.')
  }
} else {
  await mkdir(path.dirname(schemaPath), { recursive: true })
  await writeFile(schemaPath, nextSnapshot, 'utf8')
  console.log(`OpenAPI 명세를 ${path.relative(process.cwd(), schemaPath)}에 저장했습니다.`)
}
