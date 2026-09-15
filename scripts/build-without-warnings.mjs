import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const WARNING = /\[WARN\]|warning:/i

export function assertBuildOutput({ stdout, stderr, routeFiles }) {
  const output = `${stdout}\n${stderr}`
  if (WARNING.test(output)) {
    throw new Error('Build emitted a warning.')
  }
  if (routeFiles.includes('notFound.stylex')) {
    throw new Error('Build emitted accidental route output dist/notFound.stylex.')
  }
}

export async function runBuild({ cwd }) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const child = spawn(command, ['run', 'build'], { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk) => { stdout += chunk })
  child.stderr.on('data', (chunk) => { stderr += chunk })

  const status = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('close', resolve)
  })

  process.stdout.write(stdout)
  process.stderr.write(stderr)
  if (status !== 0) throw new Error(`Build exited with status ${status}.`)

  const dist = join(cwd, 'dist')
  const routeFiles = existsSync(dist) ? readdirSync(dist) : []
  assertBuildOutput({ stdout, stderr, routeFiles })
}

const invokedAsScript = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedAsScript) {
  await runBuild({ cwd: process.cwd() })
}
