import { findDestination, type Destination } from "./destinations"

/**
 * The trip brief: everything an agent knows about the trip they are selling.
 * Plain data so it can be persisted, unit-tested and turned into prompts by
 * `lib/travel/formats.ts`. Nothing here is trusted server-side; it only
 * shapes the prompt the user then submits through the normal generator.
 */

export const TRIP_TYPES = [
  {
    id: "honeymoon",
    label: "Honeymoon",
    people: "a happy couple in their thirties",
    mood: "romantic, intimate and dreamy",
  },
  {
    id: "family",
    label: "Family holiday",
    people: "a cheerful family with two young children",
    mood: "joyful, warm and carefree",
  },
  {
    id: "adventure",
    label: "Adventure",
    people: "a small group of energetic young travellers",
    mood: "bold, energetic and thrilling",
  },
  {
    id: "luxury",
    label: "Luxury escape",
    people: "an elegant couple in tailored resort wear",
    mood: "refined, exclusive and serene",
  },
  {
    id: "culture",
    label: "Culture & heritage",
    people: "curious travellers in their forties exploring on foot",
    mood: "rich, authentic and immersive",
  },
  {
    id: "beach",
    label: "Beach break",
    people: "relaxed friends in summer clothes",
    mood: "sunny, breezy and laid-back",
  },
  {
    id: "wellness",
    label: "Wellness retreat",
    people: "a calm traveller in light linen",
    mood: "peaceful, restorative and mindful",
  },
  {
    id: "spiritual",
    label: "Spiritual journey",
    people: "respectful pilgrims of mixed ages",
    mood: "reverent, calm and uplifting",
  },
  {
    id: "group",
    label: "Group tour",
    people: "a friendly mixed-age tour group with a guide",
    mood: "social, fun and welcoming",
  },
  {
    id: "solo",
    label: "Solo travel",
    people: "a confident solo traveller with a backpack",
    mood: "free, inspiring and personal",
  },
] as const

export type TripTypeId = (typeof TRIP_TYPES)[number]["id"]
export type TripType = (typeof TRIP_TYPES)[number]

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AED",
  "INR",
  "AUD",
  "CAD",
  "SGD",
  "SAR",
  "JPY",
  "ZAR",
] as const

export type Currency = (typeof CURRENCIES)[number]

export const PRICE_BASES = {
  person: "per person",
  couple: "per couple",
  total: "total",
} as const

export type PriceBasis = keyof typeof PRICE_BASES

export interface TripBrief {
  /** A library slug, or "" with `customDestination` set. */
  destination: string
  customDestination: string
  tripType: TripTypeId
  /** Hotel, resort or package name. */
  stay: string
  /** 0 = not set. */
  nights: number
  /** 0 = not set. */
  price: number
  currency: Currency
  priceBasis: PriceBasis
  /** Optional poster headline; derived from the destination when empty. */
  headline: string
  /** Comma- or line-separated selling points (inclusions, perks). */
  highlights: string
  /** One line per day, e.g. "Day 1: Arrival and sunset cruise". */
  itinerary: string
  agencyName: string
  /** Contact or call to action printed on posters: phone, site or "Book now". */
  contact: string
}

export const EMPTY_BRIEF: TripBrief = {
  destination: "santorini",
  customDestination: "",
  tripType: "honeymoon",
  stay: "",
  nights: 5,
  price: 0,
  currency: "USD",
  priceBasis: "person",
  headline: "",
  highlights: "",
  itinerary: "",
  agencyName: "",
  contact: "",
}

/** Field limits keep poster text short enough for image models to render cleanly. */
export const LIMITS = {
  customDestination: 60,
  stay: 60,
  headline: 40,
  highlights: 300,
  itinerary: 1200,
  agencyName: 40,
  contact: 40,
  nights: 60,
  price: 10_000_000,
} as const

export function tripType(id: TripTypeId): TripType {
  return TRIP_TYPES.find((item) => item.id === id) ?? TRIP_TYPES[0]
}

/** The library entry for the brief, if it names one. */
export function briefDestination(brief: TripBrief): Destination | undefined {
  return brief.destination ? findDestination(brief.destination) : undefined
}

/** The place name to print and prompt with. */
export function destinationName(brief: TripBrief): string {
  return (
    briefDestination(brief)?.name ??
    clean(brief.customDestination, LIMITS.customDestination)
  )
}

/** Collapse whitespace, cap length and swap double quotes (they delimit rendered text). */
export function clean(value: string, max: number): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .trim()
    .slice(0, max)
    .trim()
}

export function list(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => clean(item, 80))
    .filter(Boolean)
}

export interface ItineraryDay {
  day: number
  title: string
}

/**
 * Parse "Day 1: Arrival" lines. Lines without a "Day N" prefix are numbered
 * in order, so a plain list works too.
 */
export function parseItinerary(value: string): ItineraryDay[] {
  const days: ItineraryDay[] = []
  for (const raw of value.split("\n")) {
    const line = raw.trim()
    if (!line) continue
    const match = /^day\s*(\d{1,2})\s*[:.\-–—)]?\s*(.*)$/i.exec(line)
    const day = match ? Number(match[1]) : days.length + 1
    const title = clean(match ? match[2] : line, 60)
    if (title) days.push({ day, title })
  }
  return days.slice(0, 30)
}

/** "5 nights / 6 days", or "" when nights are not set. */
export function durationLabel(nights: number): string {
  if (!Number.isFinite(nights) || nights <= 0) return ""
  const n = Math.min(Math.round(nights), LIMITS.nights)
  return `${n} ${n === 1 ? "night" : "nights"} / ${n + 1} days`
}

/** "From $1,299 per person", or "" when no price is set. */
export function priceLabel(brief: TripBrief): string {
  if (!Number.isFinite(brief.price) || brief.price <= 0) return ""
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: brief.currency,
    maximumFractionDigits: 0,
  }).format(Math.min(brief.price, LIMITS.price))
  const basis = PRICE_BASES[brief.priceBasis]
  return basis === "total" ? `From ${amount}` : `From ${amount} ${basis}`
}

/** Missing pieces that stop every format from building. */
export function briefProblem(brief: TripBrief): string | null {
  if (!destinationName(brief)) return "Choose a destination or type one in."
  return null
}
