/**
 * Free check that HF_CREDENTIALS reaches the Higgsfield API and is accepted.
 * It asks for the status of a request id that does not exist: an accepted
 * key gets "not found", a rejected one gets 401. Nothing is generated or
 * billed, and the key is never printed.
 *
 *   pnpm hf:check
 *
 * Docs: https://docs.higgsfield.ai/docs/authentication.md
 */
import "./load-env"

const base = (
  process.env.HF_API_BASE_URL || "https://api.higgsfield.ai"
).replace(/\/$/, "")
const credentials = process.env.HF_CREDENTIALS?.trim() ?? ""

if (!credentials) {
  console.error(
    "HF_CREDENTIALS is not set. Add KEY_ID:KEY_SECRET as an environment variable or in .env.local."
  )
  process.exit(1)
}
if (!/^[^:\s]+:[^:\s]+$/.test(credentials)) {
  console.error(
    "HF_CREDENTIALS must be KEY_ID:KEY_SECRET (one colon, no spaces)."
  )
  process.exit(1)
}
if (credentials === "mock:mock" || !base.startsWith("https://")) {
  console.error(
    `HF_API_BASE_URL is ${base} with mock credentials; point it at https://api.higgsfield.ai to check a real key.`
  )
  process.exit(1)
}

const response = await fetch(
  `${base}/requests/00000000-0000-0000-0000-000000000000/status`,
  { headers: { Authorization: `Key ${credentials}` } }
)

if (response.status === 401 || response.status === 403) {
  console.error(
    `Rejected (${response.status}): the API did not accept this key.`
  )
  process.exit(1)
}
console.log(
  `Accepted: ${base} recognised the key (lookup of a missing request returned ${response.status}). Nothing was generated.`
)
