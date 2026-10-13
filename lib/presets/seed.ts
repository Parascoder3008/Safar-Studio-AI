import { ObjectId, type Collection } from "mongodb"

import type { PresetDoc } from "@/lib/db/collections"

import { PRESET_LOOPS, PRESET_SEED } from "./seed-data"

export function coverFor(slug: string): string {
  return `/media/presets/${slug}.jpg`
}

/**
 * Insert launch presets that don't exist yet (never overwrites admin edits).
 * Takes the collection so database setup can seed without a circular import.
 */
export async function seedPresetDocs(
  presets: Collection<PresetDoc>
): Promise<number> {
  let inserted = 0
  for (const seed of PRESET_SEED) {
    const now = new Date()
    const result = await presets.updateOne(
      { slug: seed.slug },
      {
        $setOnInsert: {
          _id: new ObjectId(),
          ...seed,
          coverUrl: coverFor(seed.slug),
          ...(PRESET_LOOPS[seed.slug]
            ? { coverVideoUrl: PRESET_LOOPS[seed.slug] }
            : {}),
          active: true,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    )
    if (result.upsertedCount) inserted++
  }
  return inserted
}
