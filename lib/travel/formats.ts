import type { Surface } from "@/generation/catalog/types"

import {
  briefDestination,
  clean,
  destinationName,
  durationLabel,
  LIMITS,
  list,
  parseItinerary,
  priceLabel,
  tripType,
  type ItineraryDay,
  type TripBrief,
} from "./brief"

/**
 * Travel formats: the deliverables a travel team actually posts. Each one
 * picks the model that is good at that job (Ideogram for legible poster text,
 * Seedance for multi-shot reels, Kling for smooth camera moves, Soul for
 * photoreal people) and writes the prompt from the trip brief.
 *
 * `buildContent` is pure: same brief in, same prompt out. Settings must be
 * valid for the model's catalog entry (tests/travel.test.ts checks this).
 */

export type TravelFormatId =
  | "destination-reel"
  | "hotel-walkthrough"
  | "drone-reveal"
  | "package-poster"
  | "itinerary-day"
  | "traveller-moment"
  | "website-hero"
  | "local-flavours"

export interface TravelFormat {
  id: TravelFormatId
  title: string
  description: string
  /** Where the result is meant to go. */
  channel: string
  surface: Extract<Surface, "image" | "video">
  modelId: string
  settings: Record<string, unknown>
  /** A photo the agent should add as the start frame in the generator. */
  photo?: { label: string; required: boolean }
  /** Builds one card per itinerary day. */
  perDay?: boolean
}

export const TRAVEL_FORMATS: readonly TravelFormat[] = [
  {
    id: "destination-reel",
    title: "Destination teaser reel",
    description:
      "A vertical multi-shot teaser: aerial landmark, travellers in the moment, golden-hour finish.",
    channel: "Reels · TikTok · Shorts",
    surface: "video",
    modelId: "seedance-2.5",
    settings: {
      aspectRatio: "9:16",
      duration: 10,
      resolution: "720p",
      generateAudio: true,
    },
  },
  {
    id: "hotel-walkthrough",
    title: "Hotel walkthrough",
    description:
      "Bring a hotel or room photo to life with a slow gimbal glide through the space.",
    channel: "Reels · Stories · WhatsApp",
    surface: "video",
    modelId: "kling-3-std",
    settings: { aspectRatio: "9:16", duration: 8, generateAudio: true },
    photo: { label: "Hotel or room photo", required: true },
  },
  {
    id: "drone-reveal",
    title: "Drone reveal",
    description:
      "A rising aerial shot that reveals the destination's most famous view.",
    channel: "Website · YouTube · Ads",
    surface: "video",
    modelId: "kling-3-std",
    settings: { aspectRatio: "16:9", duration: 8, generateAudio: true },
  },
  {
    id: "package-poster",
    title: "Package ad poster",
    description:
      "A feed-ready poster with your headline, duration, price and contact printed on it.",
    channel: "Instagram feed · Facebook ads",
    surface: "image",
    modelId: "ideogram-4",
    settings: { aspectRatio: "4:5", renderingSpeed: "QUALITY" },
  },
  {
    id: "itinerary-day",
    title: "Itinerary day card",
    description:
      "One card per day of the trip, titled and illustrated, ready for a carousel.",
    channel: "Carousels · Brochures",
    surface: "image",
    modelId: "ideogram-4",
    settings: { aspectRatio: "4:5", renderingSpeed: "QUALITY" },
    perDay: true,
  },
  {
    id: "traveller-moment",
    title: "Traveller moment",
    description:
      "A candid lifestyle photo of your kind of traveller enjoying the destination.",
    channel: "Instagram · Pinterest",
    surface: "image",
    modelId: "soul-2",
    settings: { aspectRatio: "3:4", resolution: "1080p" },
  },
  {
    id: "website-hero",
    title: "Website hero banner",
    description:
      "A wide cinematic establishing shot with space for your headline.",
    channel: "Website · Email header",
    surface: "image",
    modelId: "soul-cinema",
    settings: { aspectRatio: "16:9", resolution: "1080p" },
  },
  {
    id: "local-flavours",
    title: "Local flavours",
    description:
      "Signature local food styled with the destination in the background.",
    channel: "Instagram · Blog",
    surface: "image",
    modelId: "soul-2",
    settings: { aspectRatio: "1:1", resolution: "1080p" },
  },
]

export function findFormat(id: string): TravelFormat | undefined {
  return TRAVEL_FORMATS.find((format) => format.id === id)
}

interface Facts {
  name: string
  where: string
  landmarks: string[]
  scenery: string
  experiences: string[]
  cuisine: string[]
}

/** Library facts, or neutral phrasing for a destination typed by hand. */
function facts(brief: TripBrief): Facts {
  const known = briefDestination(brief)
  const name = destinationName(brief)
  if (known)
    return {
      name: known.name,
      where:
        known.country === known.name
          ? known.name
          : `${known.name}, ${known.country}`,
      landmarks: [...known.landmarks],
      scenery: known.scenery,
      experiences: [...known.experiences],
      cuisine: [...known.cuisine],
    }
  return {
    name,
    where: name,
    landmarks: [
      `the most iconic landmark of ${name}`,
      `a famous viewpoint in ${name}`,
    ],
    scenery: `the signature scenery, light and colours of ${name}`,
    experiences: [
      `a signature local experience in ${name}`,
      `exploring ${name}`,
    ],
    cuisine: [`a signature local dish of ${name}`],
  }
}

/**
 * The days to offer for itinerary cards: the brief's own itinerary, or one
 * day per signature experience when the agent hasn't written one yet.
 */
export function itineraryDays(brief: TripBrief): ItineraryDay[] {
  const parsed = parseItinerary(brief.itinerary)
  if (parsed.length > 0) return parsed
  if (!destinationName(brief)) return []
  return facts(brief).experiences.map((title, index) => ({
    day: index + 1,
    title: title.charAt(0).toUpperCase() + title.slice(1),
  }))
}

function headline(brief: TripBrief, place: string): string {
  const custom = clean(brief.headline, LIMITS.headline)
  if (custom) return custom
  const label = tripType(brief.tripType).label
  return clean(`${place} ${label}`, LIMITS.headline).toUpperCase()
}

/** `Text: "…".` lines for the poster formats, skipping empty values. */
function textLines(lines: [label: string, value: string][]): string {
  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label} "${value}".`)
    .join(" ")
}

function sentence(parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim()
}

export interface TravelContent {
  format: TravelFormat
  surface: TravelFormat["surface"]
  modelId: string
  settings: Record<string, unknown>
  prompt: string
}

/** Turn a brief into the prompt, model and settings for one format. */
export function buildContent(
  format: TravelFormat,
  brief: TripBrief,
  day?: ItineraryDay
): TravelContent {
  const f = facts(brief)
  const trip = tripType(brief.tripType)
  const stay = clean(brief.stay, LIMITS.stay)
  const agency = clean(brief.agencyName, LIMITS.agencyName)
  const contact = clean(brief.contact, LIMITS.contact)
  const footer = [agency, contact].filter(Boolean).join(" · ")
  const [first, second] = f.landmarks
  const [experience] = f.experiences

  let prompt: string
  switch (format.id) {
    case "destination-reel":
      prompt = sentence([
        `Vertical travel teaser reel for ${f.where}, ${trip.mood} mood.`,
        `Shot 1: sweeping aerial establishing shot of ${first}.`,
        `Shot 2: ${trip.people} enjoying ${experience}.`,
        `Shot 3: close-up details of ${f.scenery}.`,
        `Shot 4: golden-hour wide shot of ${second ?? first}${stay ? `, ending at ${stay}` : ""}.`,
        "Smooth cinematic camera moves, fast social-media pacing, vibrant natural colour grade, ambient sounds of the place, no on-screen text.",
      ])
      break
    case "hotel-walkthrough":
      prompt = sentence([
        `Smooth gimbal walkthrough of ${stay || "a beautiful hotel"} in ${f.name}.`,
        "Start exactly from the opening frame and glide slowly forward through the space, revealing the room, its details and the view outside.",
        `Natural daylight, ${trip.mood} atmosphere, realistic architecture, steady luxurious pace, soft ambient sound, no people talking, no on-screen text.`,
      ])
      break
    case "drone-reveal":
      prompt = sentence([
        `Cinematic drone shot over ${f.where}.`,
        `The camera rises slowly and pushes forward to reveal ${first}, with ${f.scenery}.`,
        `Golden-hour light, smooth stabilised motion, epic sense of scale, ${trip.mood} feel, natural ambient sound, no on-screen text.`,
      ])
      break
    case "package-poster": {
      const highlights = list(brief.highlights).slice(0, 3)
      prompt = sentence([
        `Travel advertisement poster for a ${trip.label.toLowerCase()} package to ${f.where}.`,
        `Background photograph: ${first}, ${f.scenery}, with ${trip.people}.`,
        textLines([
          ["Large bold headline text", headline(brief, f.name)],
          ["Text below the headline", stay],
          ["Text", durationLabel(brief.nights)],
          ["Prominent price text", priceLabel(brief)],
          ...highlights.map((item): [string, string] => [
            "Small bullet text",
            item,
          ]),
          ["Small text at the bottom", footer],
        ]),
        "Clean modern travel-brand layout, high-contrast legible typography, every word spelled exactly as written, generous margins, premium photographic look.",
      ])
      break
    }
    case "itinerary-day": {
      const chosen = day ?? itineraryDays(brief)[0]
      const number = chosen?.day ?? 1
      const title = chosen?.title ?? experience
      prompt = sentence([
        `Social media itinerary card for day ${number} of a ${trip.label.toLowerCase()} itinerary in ${f.where}.`,
        `Background photograph illustrating "${title}" in ${f.name}: ${f.scenery}.`,
        textLines([
          ["Bold heading text", `DAY ${number}`],
          ["Text", title],
          ["Small text at the bottom", agency],
        ]),
        "Clean modern travel layout, legible typography, every word spelled exactly as written, consistent brand style.",
      ])
      break
    }
    case "traveller-moment":
      prompt = sentence([
        `Authentic lifestyle travel photograph: ${trip.people} enjoying ${experience} in ${f.name}, with ${first} in the background.`,
        `${capitalise(f.scenery)}.`,
        `${capitalise(trip.mood)} mood, candid natural moment, golden-hour light, full-frame camera, shallow depth of field, editorial travel magazine quality.`,
      ])
      break
    case "website-hero":
      prompt = sentence([
        `Wide cinematic establishing shot of ${f.where}: ${first}, ${f.scenery}.`,
        "Dramatic golden-hour sky, layered depth, calm negative space on the left third for a headline, ultra-detailed travel photography, no text, no watermark.",
      ])
      break
    case "local-flavours":
      prompt = sentence([
        `Mouth-watering food photograph of ${f.cuisine[0]} served at a table overlooking ${first} in ${f.name}.`,
        "Natural light, shallow depth of field, fresh ingredients, vibrant colours, travel food magazine styling, no text.",
      ])
      break
  }

  return {
    format,
    surface: format.surface,
    modelId: format.modelId,
    settings: { ...format.settings },
    prompt,
  }
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
