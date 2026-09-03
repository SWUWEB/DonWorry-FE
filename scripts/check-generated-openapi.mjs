import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const generatedDirectory = path.resolve('src/api/generated')

async function readGeneratedFiles(directory) {
  const files = new Map()

  async function visit(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true }).catch((error) => {
      if (error.code === 'ENOENT') return []
      throw error
    })

    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name)

      if (entry.isDirectory()) {
        await visit(absolutePath)
      } else {
        const relativePath = path.relative(directory, absolutePath)
        files.set(relativePath, await readFile(absolutePath, 'utf8'))
      }
    }
  }

  await visit(directory)
  return files
}

const before = await readGeneratedFiles(generatedDirectory)
const generator = path.resolve('node_modules/@hey-api/openapi-ts/bin/run.js')
const generation = spawnSync(process.execPath, [generator], { stdio: 'inherit' })

if (generation.error) throw generation.error
if (generation.status !== 0) process.exit(generation.status ?? 1)

const after = await readGeneratedFiles(generatedDirectory)
const paths = [...new Set([...before.keys(), ...after.keys()])].sort()
const changedPaths = paths.filter((filePath) => before.get(filePath) !== after.get(filePath))

if (changedPaths.length > 0) {
  console.error('OpenAPI 생성 파일이 최신 상태가 아닙니다:')
  for (const filePath of changedPaths) console.error(`- src/api/generated/${filePath}`)
  console.error('생성된 변경을 검토한 뒤 커밋하세요.')
  process.exitCode = 1
} else {
  console.log('OpenAPI 생성 파일이 최신 상태입니다.')
}
