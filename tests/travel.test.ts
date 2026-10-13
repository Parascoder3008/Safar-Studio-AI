import { describe, expect, it } from "vitest"

import { findModel, parseSettings } from "@/generation/catalog"
import { groupMedia } from "@/generation/catalog/media-inputs"
import { toPlatform } from "@/generation/to-platform"
import { toCreditTable, tryPriceFor } from "@/lib/billing/price"
import { PRICING_TABLE } from "@/lib/billing/pricing-table"
import {
  durationLabel,
  EMPTY_BRIEF,
  parseItinerary,
  priceLabel,
  TRIP_TYPES,
  type TripBrief,
} from "@/lib/travel/brief"
import { DESTINATIONS, REGIONS } from "@/lib/travel/destinations"
import {
  buildContent,
  itineraryDays,
  TRAVEL_FORMATS,
} from "@/lib/travel/formats"

const table = toCreditTable(PRICING_TABLE, { markup: 2, creditUsd: 0.01 })

const FULL: TripBrief = {
  ...EMPTY_BRIEF,
  destination: "bali",
  tripType: "honeymoon",
  stay: "Ubud Jungle Villas",
  nights: 6,
  price: 1899,
  currency: "USD",
  priceBasis: "couple",
  highlights: "Private pool villa, Daily breakfast, Airport transfers",
  itinerary:
    "Day 1: Arrival and sunset dinner\nDay 2: Rice terraces and jungle swing",
  agencyName: "Wanderlust Travel",
  contact: "+1 555 0100",
}

const CUSTOM: TripBrief = {
  ...EMPTY_BRIEF,
  destination: "",
  customDestination: "Lake Bled",
  tripType: "family",
}

describe("destination library", () => {
  it("has unique slugs and complete entries in every region", () => {
    const slugs = DESTINATIONS.map((item) => item.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const region of REGIONS)
      expect(DESTINATIONS.some((item) => item.region === region)).toBe(true)
    for (const item of DESTINATIONS) {
      expect(item.landmarks.length).toBeGreaterThanOrEqual(2)
      expect(item.experiences.length).toBeGreaterThanOrEqual(2)
      expect(item.cuisine.length).toBeGreaterThanOrEqual(1)
      expect(item.scenery.length).toBeGreaterThan(20)
      expect(item.scenery).not.toContain('"')
    }
  })
})

describe("travel formats", () => {
  const briefs: [string, TripBrief][] = [
    ["empty optional fields", EMPTY_BRIEF],
    ["a full brief", FULL],
    ["a custom destination", CUSTOM],
    ...DESTINATIONS.map((item): [string, TripBrief] => [
      item.slug,
      { ...FULL, destination: item.slug },
    ]),
    ...TRIP_TYPES.map((item): [string, TripBrief] => [
      item.id,
      { ...FULL, tripType: item.id },
    ]),
  ]

  for (const format of TRAVEL_FORMATS) {
    it(`${format.id} uses a catalog model with valid, priced settings`, () => {
      const model = findModel(format.modelId)
      expect(model?.surface).toBe(format.surface)
      for (const [, brief] of briefs) {
        const content = buildContent(format, brief)
        const settings = parseSettings(model!, content.settings)
        const request = toPlatform({
          model: model!.id,
          prompt: { text: content.prompt },
          media: groupMedia([]),
          settings,
        })
        expect(request.path).toBeTruthy()
        expect(content.prompt.length).toBeGreaterThan(40)
        expect(content.prompt.length).toBeLessThanOrEqual(
          model!.maxPromptLength ?? 2000
        )
        expect(content.prompt).not.toMatch(/undefined|null|NaN/)
        expect(
          tryPriceFor(model!.id, content.settings, [], table, content.prompt)
        ).not.toBeNull()
      }
    })
  }

  it("prints the brief's text on the package poster", () => {
    const poster = TRAVEL_FORMATS.find((item) => item.id === "package-poster")!
    const { prompt } = buildContent(poster, FULL)
    expect(prompt).toContain('"BALI HONEYMOON"')
    expect(prompt).toContain('"6 nights / 7 days"')
    expect(prompt).toContain('"From $1,899 per couple"')
    expect(prompt).toContain('"Private pool villa"')
    expect(prompt).toContain('"Wanderlust Travel · +1 555 0100"')
  })

  it("leaves unset poster lines out instead of printing blanks", () => {
    const poster = TRAVEL_FORMATS.find((item) => item.id === "package-poster")!
    const { prompt } = buildContent(poster, EMPTY_BRIEF)
    expect(prompt).not.toContain('""')
    expect(prompt).not.toContain("price text")
  })

  it("keeps user quotes from breaking rendered text", () => {
    const poster = TRAVEL_FORMATS.find((item) => item.id === "package-poster")!
    const { prompt } = buildContent(poster, {
      ...FULL,
      headline: 'The "best" deal',
    })
    expect(prompt).toContain("\"The 'best' deal\"")
  })

  it("builds one itinerary card per day", () => {
    const card = TRAVEL_FORMATS.find((item) => item.id === "itinerary-day")!
    const days = itineraryDays(FULL)
    expect(days).toEqual([
      { day: 1, title: "Arrival and sunset dinner" },
      { day: 2, title: "Rice terraces and jungle swing" },
    ])
    const { prompt } = buildContent(card, FULL, days[1])
    expect(prompt).toContain('"DAY 2"')
    expect(prompt).toContain('"Rice terraces and jungle swing"')
  })

  it("falls back to the destination's experiences without an itinerary", () => {
    const days = itineraryDays({ ...FULL, itinerary: "" })
    expect(days.length).toBeGreaterThan(0)
    expect(days[0]?.day).toBe(1)
  })
})

describe("brief helpers", () => {
  it("parses numbered and plain itinerary lines", () => {
    expect(parseItinerary("Day 3 - Desert safari\nFree day\n\n")).toEqual([
      { day: 3, title: "Desert safari" },
      { day: 2, title: "Free day" },
    ])
  })

  it("formats duration and price labels", () => {
    expect(durationLabel(0)).toBe("")
    expect(durationLabel(1)).toBe("1 night / 2 days")
    expect(priceLabel({ ...FULL, price: 0 })).toBe("")
    expect(priceLabel({ ...FULL, currency: "EUR", priceBasis: "total" })).toBe(
      "From €1,899"
    )
  })
})
