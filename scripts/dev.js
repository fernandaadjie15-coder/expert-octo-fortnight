import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const children = new Set()
let stopping = false

function stop(exitCode) {
  if (stopping) {
    return
  }

  stopping = true
  process.exitCode = exitCode

  for (const child of children) {
    child.kill()
  }
}

function start(name, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    ...options,
  })
  children.add(child)

  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`)
    stop(1)
  })

  child.on('exit', (code, signal) => {
    children.delete(child)

    if (!stopping) {
      console.error(
        `[${name}] berhenti${signal ? ` karena ${signal}` : ` dengan kode ${code}`}.`,
      )
      stop(code || 1)
    }
  })
}

const npmCommand =
  process.platform === 'win32'
    ? process.env.ComSpec || 'cmd.exe'
    : 'npm'
const npmArgs =
  process.platform === 'win32'
    ? ['/d', '/s', '/c', 'npm.cmd --prefix frontend run dev']
    : ['--prefix', 'frontend', 'run', 'dev']

start('Django', 'python', ['manage.py', 'runserver', '127.0.0.1:8000'])
start('Frontend', npmCommand, npmArgs)

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
