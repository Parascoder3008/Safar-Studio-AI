import "server-only"

import { MongoClient, type Db } from "mongodb"

import { env } from "@/lib/env"

/**
 * One MongoClient per process, shared by the Auth.js adapter and the app.
 * Cached on globalThis so dev hot reloads don't open a pool per edit.
 */
type MongoCache = {
  uri: string
  client: MongoClient
  promise: Promise<MongoClient>
}

const globalForMongo = globalThis as typeof globalThis & {
  __safarstudioMongo?: MongoCache
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "MONGODB_URI is not set. Run `pnpm db:dev` for a local database or set an Atlas URI."
    )
    this.name = "DatabaseNotConfiguredError"
  }
}

function uri(): string {
  const value = env().MONGODB_URI
  if (!value) throw new DatabaseNotConfiguredError()
  return value
}

export function mongoClient(): Promise<MongoClient> {
  const target = uri()
  const cached = globalForMongo.__safarstudioMongo
  if (cached && cached.uri === target) return cached.promise
  const client = new MongoClient(target, {
    appName: "safarstudio",
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 8_000,
  })
  const promise = client.connect()
  globalForMongo.__safarstudioMongo = { uri: target, client, promise }
  promise.catch(() => {
    if (globalForMongo.__safarstudioMongo?.client === client)
      globalForMongo.__safarstudioMongo = undefined
  })
  return promise
}

export async function db(): Promise<Db> {
  return (await mongoClient()).db(env().MONGODB_DB)
}

/** Tests close the pool between suites. */
export async function closeMongoForTests(): Promise<void> {
  const cached = globalForMongo.__safarstudioMongo
  globalForMongo.__safarstudioMongo = undefined
  if (cached) await (await cached.promise).close()
}
