import { afterEach, describe, expect, it, vi } from "vitest"

import { env, EnvError, resetEnvForTests } from "@/lib/env"

const saved = { ...process.env }

function production(extra: Record<string, string> = {}) {
  for (const key of Object.keys(process.env)) delete process.env[key]
  Object.assign(process.env, { NODE_ENV: "production", ...extra })
  resetEnvForTests()
}

afterEach(() => {
  for (const key of Object.keys(process.env)) delete process.env[key]
  Object.assign(process.env, saved)
  resetEnvForTests()
  vi.restoreAllMocks()
})

describe("production environment check", () => {
  it("refuses to boot with services missing", () => {
    production()
    expect(() => env()).toThrow(EnvError)
  })

  it("boots with ALLOW_INCOMPLETE_SETUP and lists what is missing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    production({ ALLOW_INCOMPLETE_SETUP: "true", AUTH_SECRET: "x".repeat(32) })
    expect(env().ALLOW_INCOMPLETE_SETUP).toBe(true)
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]?.[0])
    expect(message).toContain("MONGODB_URI")
    expect(message).not.toContain("AUTH_SECRET")
  })
})
