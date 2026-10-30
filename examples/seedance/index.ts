/**
 * Seedance 2.5 text-to-video through the official Higgsfield SDK.
 *
 * SDK:   https://docs.higgsfield.ai/docs/how-to/sdk
 * Model: https://open.higgsfield.ai/models/bytedance/seedance-2.5/text-to-video/api-reference
 *
 * BILLABLE: one 5 s, 720p generation. It only submits with --run:
 *
 *   pnpm example:seedance          # prints what it would send, submits nothing
 *   pnpm example:seedance --run    # generates and prints the video URL
 *
 * Reads HF_CREDENTIALS (KEY_ID:KEY_SECRET) from the environment or .env.local
 * and never prints it. Server-side only.
 */
import "../../scripts/load-env"

import { APIError, config, higgsfield } from "@higgsfield/client/v2"

const MODEL = "bytedance/seedance-2.5/text-to-video"
const INPUT = {
  prompt: "A cinematic scene at sunset",
  duration: 5,
  resolution: "720p",
  aspect_ratio: "16:9",
}

const credentials = process.env.HF_CREDENTIALS?.trim()
if (!credentials || !/^[^:\s]+:[^:\s]+$/.test(credentials)) {
  console.error(
    "HF_CREDENTIALS must be set to KEY_ID:KEY_SECRET (environment variable or .env.local)."
  )
  process.exit(1)
}

if (!process.argv.includes("--run")) {
  console.log(
    `Dry run: would submit ${MODEL} with ${JSON.stringify(INPUT)}.\nThis is billable. Re-run with --run to generate.`
  )
  process.exit(0)
}

config({
  credentials,
  // Canceled requests are not a stop state for the SDK's poller; cap the wait.
  maxPollTime: 15 * 60_000,
})

try {
  const result = await higgsfield.subscribe(MODEL, {
    input: INPUT,
    withPolling: true,
  })
  // The API can also report "canceled", which the SDK's type does not list.
  const status: string = result.status
  const url = result.video?.url
  if (status === "completed" && url) {
    console.log(`Completed (${result.request_id}): ${url}`)
  } else if (status === "nsfw") {
    console.error(`Blocked by content moderation (${result.request_id}).`)
    process.exitCode = 1
  } else {
    console.error(
      `Did not complete (${result.request_id}): status "${status}"${url ? "" : ", no video URL"}.`
    )
    process.exitCode = 1
  }
} catch (error) {
  const detail =
    error instanceof APIError
      ? `${error.message} (HTTP ${error.statusCode})`
      : error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error)
  console.error(`Generation failed: ${detail}`)
  process.exitCode = 1
}
