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
  it("boots with services missing and lists them once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    production({ AUTH_SECRET: "x".repeat(32) })
    expect(env().NODE_ENV).toBe("production")
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]?.[0])
    expect(message).toContain("MONGODB_URI")
    expect(message).not.toContain("AUTH_SECRET")
  })

  it("refuses to boot with services missing when REQUIRE_ALL_SERVICES is on", () => {
    for (const value of ["true", "TRUE", " 1 "]) {
      production({ REQUIRE_ALL_SERVICES: value })
      expect(() => env()).toThrow(EnvError)
    }
  })

  it("ignores an invalid value and uses its default", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    production({ APP_URL: "safar-studio-ai.vercel.app", E2E_TEST_MODE: "yes" })
    expect(env().APP_URL).toBe("http://localhost:3000")
    expect(env().E2E_TEST_MODE).toBe(false)
    expect(String(error.mock.calls[0]?.[0])).toContain("APP_URL")
  })

  it("rejects an invalid value when REQUIRE_ALL_SERVICES is on", () => {
    production({ REQUIRE_ALL_SERVICES: "true", APP_URL: "not a url" })
    expect(() => env()).toThrow(/Invalid environment/)
  })

  it("reads booleans in any case and with stray spaces", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {})
    for (const value of ["TRUE", " True ", "1"]) {
      production({ E2E_TEST_MODE: value })
      expect(env().E2E_TEST_MODE).toBe(true)
    }
  })
})
