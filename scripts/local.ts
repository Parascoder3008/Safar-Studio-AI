/**
 * The whole app on your own computer with one command, no accounts needed:
 *
 *   pnpm local
 *
 * First run writes .env.local (offline defaults). Then it starts the local
 * MongoDB replica set and the mock Higgsfield API, unless .env.local points
 * at real ones, and finally the Next dev server on http://localhost:3000.
 * Magic sign-in links print in this terminal. Ctrl+C stops everything.
 */
import { spawn, type ChildProcess } from "node:child_process"
import { randomBytes } from "node:crypto"
import { existsSync, writeFileSync } from "node:fs"
import { connect } from "node:net"
import { loadEnvFile } from "node:process"

const ENV_FILE = ".env.local"
const LOCAL_MONGO = "mongodb://127.0.0.1:27027/?replicaSet=safarstudio"
const LOCAL_HF = "http://localhost:4010"

const [major = 0, minor = 0] = process.versions.node.split(".").map(Number)
if (major < 20 || (major === 20 && minor < 12)) {
  console.error(
    `[local] Node ${process.versions.node} is too old. Install Node 22 or newer from https://nodejs.org and try again.`
  )
  process.exit(1)
}

if (!existsSync(ENV_FILE)) {
  writeFileSync(
    ENV_FILE,
    [
      "# Written by `pnpm local`: an offline stack. See .env.example to add real services.",
      `AUTH_SECRET=${randomBytes(32).toString("base64")}`,
      "APP_URL=http://localhost:3000",
      "AUTH_URL=http://localhost:3000",
      `MONGODB_URI=${LOCAL_MONGO}`,
      `HF_API_BASE_URL=${LOCAL_HF}`,
      "HF_CREDENTIALS=mock:mock",
      "SIGNUP_BONUS_CREDITS=200",
      "",
    ].join("\n")
  )
  console.log(`[local] Wrote ${ENV_FILE} with offline settings.`)
}
loadEnvFile(ENV_FILE)

const useLocalMongo = (process.env.MONGODB_URI ?? "").includes(
  "127.0.0.1:27027"
)
const useMockHf = (process.env.HF_API_BASE_URL ?? "").startsWith(LOCAL_HF)

const children: ChildProcess[] = []
let stopping = false

function stop(code: number): void {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill("SIGINT")
  setTimeout(() => process.exit(code), 1500)
}
process.on("SIGINT", () => stop(0))
process.on("SIGTERM", () => stop(0))

function run(name: string, script: string, onExit?: () => void): ChildProcess {
  const child = spawn("pnpm", [script], {
    stdio: ["ignore", "pipe", "pipe"],
    // pnpm is a .cmd shim on Windows.
    shell: process.platform === "win32",
  })
  const relay = (write: (line: string) => void) => (chunk: Buffer) => {
    for (const line of chunk.toString().split(/\r?\n/))
      if (line.trim()) write(`[${name}] ${line}`)
  }
  child.stdout?.on(
    "data",
    relay((line) => console.log(line))
  )
  child.stderr?.on(
    "data",
    relay((line) => console.error(line))
  )
  child.on("exit", (code) => {
    if (stopping) return
    onExit?.()
    console.error(
      `[local] ${name} stopped (exit ${code ?? "?"}). Stopping the rest.`
    )
    stop(code || 1)
  })
  children.push(child)
  return child
}

function portOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host: "127.0.0.1", port })
    socket.once("connect", () => {
      socket.destroy()
      resolve(true)
    })
    socket.once("error", () => resolve(false))
  })
}

async function waitForPort(port: number, seconds: number): Promise<boolean> {
  for (let i = 0; i < seconds; i++) {
    if (stopping) return false
    if (await portOpen(port)) return true
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

async function main(): Promise<void> {
  if (useLocalMongo) {
    console.log(
      "[local] Starting the local database. The first run downloads MongoDB (about 100 MB)."
    )
    run("db", "db:dev", () =>
      console.error(
        "[local] The local database could not start. It needs internet the first time, to download MongoDB."
      )
    )
    if (!(await waitForPort(27027, 300))) {
      if (!stopping) {
        console.error(
          "[local] The local database did not start within 5 minutes."
        )
        stop(1)
      }
      return
    }
  }
  if (useMockHf) run("mock", "mock:higgsfield")
  run("web", "dev")

  if (await waitForPort(3000, 180))
    console.log(
      [
        "",
        "[local] Ready: open http://localhost:3000/travel",
        "[local] Sign in with any email; the sign-in link prints below as [email:dev] Link.",
        useMockHf
          ? "[local] Generation uses the mock API: results are sample media, not real AI output."
          : "[local] Generation uses the real Higgsfield API from .env.local.",
        "",
      ].join("\n")
    )
}

await main()
