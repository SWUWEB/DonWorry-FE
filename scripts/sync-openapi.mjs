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

// 서버가 같은 내용을 키 순서만 다르게 돌려주면 문자열 비교가 어긋나 drift로 잘못 잡힙니다.
// 배열은 순서가 의미를 가지므로 그대로 두고, 객체 키만 재귀적으로 정렬해 비교 기준을 고정합니다.
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value === null || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  )
}

const schema = canonicalize(await response.json())
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
