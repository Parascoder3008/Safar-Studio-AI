"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Camera,
  ChevronDown,
  ImageIcon,
  MapPin,
  RotateCcw,
  Sparkle,
  Video,
} from "lucide-react"
import { cn } from "cn"

import { useApp } from "@/components/providers/app-providers"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { findModel } from "@/generation/catalog"
import { useDock } from "@/generation/stores/dock"
import { useSettings } from "@/generation/stores/settings"
import { tryPriceFor } from "@/lib/billing/price"
import { useHydrated } from "@/lib/studio/local-flag"
import {
  briefDestination,
  briefProblem,
  CURRENCIES,
  LIMITS,
  PRICE_BASES,
  TRIP_TYPES,
  type Currency,
  type PriceBasis,
  type TripBrief,
  type TripTypeId,
} from "@/lib/travel/brief"
import { useTripBrief } from "@/lib/travel/brief-store"
import { destinationsByRegion, REGIONS } from "@/lib/travel/destinations"
import {
  buildContent,
  itineraryDays,
  TRAVEL_FORMATS,
  type TravelContent,
  type TravelFormat,
} from "@/lib/travel/formats"

const OTHER = "__other"

/**
 * Travel Studio: the agent fills one trip brief, then turns it into any
 * travel format. "Create" loads the format's model, settings and prompt into
 * the generator, where the normal Generate button prices and submits it.
 */
export function TravelStudio() {
  const hydrated = useHydrated()
  const brief = useTripBrief((state) => state.brief)
  const update = useTripBrief((state) => state.update)
  const reset = useTripBrief((state) => state.reset)

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start lg:gap-8 lg:py-8">
        <aside
          aria-labelledby="brief-title"
          className="flex w-full shrink-0 flex-col gap-4 rounded-2xl bg-panel p-4 lg:sticky lg:top-6 lg:w-[400px]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 id="brief-title" className="font-display text-xl">
              Trip brief
            </h2>
            <button
              type="button"
              onClick={reset}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Reset
            </button>
          </div>
          {hydrated ? (
            <BriefForm brief={brief} update={update} />
          ) : (
            <div className="h-[640px] animate-pulse rounded-xl bg-surface" />
          )}
        </aside>

        <section aria-labelledby="formats-title" className="min-w-0 flex-1">
          <header className="mb-5 flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-lime uppercase">
              Travel Studio
            </p>
            <h1
              id="formats-title"
              className="font-display text-[34px] leading-[0.95] md:text-[48px]"
            >
              One brief. Every format.
            </h1>
            <p className="max-w-[620px] text-sm text-muted-foreground md:text-base">
              Describe the trip once. Each format below writes its own prompt
              from your brief and opens it in the generator with the right model
              and size, ready to generate.
            </p>
          </header>
          {hydrated ? (
            <FormatGrid brief={brief} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {TRAVEL_FORMATS.map((format) => (
                <div
                  key={format.id}
                  className="h-64 animate-pulse rounded-2xl bg-panel"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* ── Brief form ──────────────────────────────────────────────────────────── */

const TEXTAREA =
  "w-full resize-none rounded-[10px] bg-white/5 px-3 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-lime/70"

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function BriefForm({
  brief,
  update,
}: {
  brief: TripBrief
  update: (patch: Partial<TripBrief>) => void
}) {
  const grouped = useMemo(() => destinationsByRegion(), [])
  const destination = briefDestination(brief)
  const trip = TRIP_TYPES.find((item) => item.id === brief.tripType)
  const number = (value: string) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field id="brief-destination" label="Destination">
        <Select
          value={brief.destination || OTHER}
          onValueChange={(next) => {
            if (next == null) return
            const value = String(next)
            update({ destination: value === OTHER ? "" : value })
          }}
        >
          <SelectTrigger id="brief-destination" className="w-full">
            <SelectValue>
              {() =>
                destination
                  ? `${destination.name}, ${destination.country}`
                  : "Somewhere else"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            variant="picker"
            surface="solid"
            className="max-h-[420px]"
          >
            {REGIONS.map((region) => (
              <SelectGroup key={region}>
                <SelectGroupLabel>{region}</SelectGroupLabel>
                {grouped[region].map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    <SelectItemText>
                      {item.name}
                      <span className="text-muted-foreground">
                        {" "}
                        · {item.country}
                      </span>
                    </SelectItemText>
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
            <SelectGroup>
              <SelectGroupLabel>Not listed</SelectGroupLabel>
              <SelectItem value={OTHER}>
                <SelectItemText>Somewhere else</SelectItemText>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {destination ? (
        <div className="flex flex-col gap-1 rounded-xl bg-surface px-3 py-2.5 text-xs text-muted-foreground">
          <p className="flex items-start gap-1.5 text-foreground">
            <MapPin
              className="mt-0.5 size-3.5 shrink-0 text-lime"
              aria-hidden
            />
            {destination.landmarks.join(" · ")}
          </p>
          <p>Best time: {destination.bestMonths}</p>
        </div>
      ) : (
        <Field id="brief-custom" label="Destination name">
          <Input
            id="brief-custom"
            value={brief.customDestination}
            maxLength={LIMITS.customDestination}
            placeholder="e.g. Lake Bled, Slovenia"
            onChange={(event) =>
              update({ customDestination: event.target.value })
            }
          />
        </Field>
      )}

      <Field id="brief-trip" label="Trip type" hint={trip?.mood}>
        <Select
          value={brief.tripType}
          onValueChange={(next) =>
            next != null && update({ tripType: String(next) as TripTypeId })
          }
        >
          <SelectTrigger id="brief-trip" className="w-full">
            <SelectValue>
              {() => trip?.label ?? "Choose a trip type"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent variant="picker" surface="solid">
            {TRIP_TYPES.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="brief-stay" label="Hotel or package name (optional)">
        <Input
          id="brief-stay"
          value={brief.stay}
          maxLength={LIMITS.stay}
          placeholder="e.g. Canaves Oia Suites"
          onChange={(event) => update({ stay: event.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field id="brief-nights" label="Nights">
          <Input
            id="brief-nights"
            type="number"
            inputMode="numeric"
            min={0}
            max={LIMITS.nights}
            value={brief.nights || ""}
            placeholder="5"
            onChange={(event) =>
              update({
                nights: Math.min(number(event.target.value), LIMITS.nights),
              })
            }
          />
        </Field>
        <Field id="brief-price" label="Price from">
          <Input
            id="brief-price"
            type="number"
            inputMode="numeric"
            min={0}
            value={brief.price || ""}
            placeholder="1299"
            onChange={(event) =>
              update({
                price: Math.min(number(event.target.value), LIMITS.price),
              })
            }
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="brief-currency" label="Currency">
          <Select
            value={brief.currency}
            onValueChange={(next) =>
              next != null && update({ currency: String(next) as Currency })
            }
          >
            <SelectTrigger id="brief-currency" className="w-full">
              <SelectValue>{() => brief.currency}</SelectValue>
            </SelectTrigger>
            <SelectContent variant="picker" surface="solid">
              {CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  <SelectItemText>{code}</SelectItemText>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="brief-basis" label="Price is">
          <Select
            value={brief.priceBasis}
            onValueChange={(next) =>
              next != null && update({ priceBasis: String(next) as PriceBasis })
            }
          >
            <SelectTrigger id="brief-basis" className="w-full">
              <SelectValue>{() => PRICE_BASES[brief.priceBasis]}</SelectValue>
            </SelectTrigger>
            <SelectContent variant="picker" surface="solid">
              {(Object.keys(PRICE_BASES) as PriceBasis[]).map((key) => (
                <SelectItem key={key} value={key}>
                  <SelectItemText>{PRICE_BASES[key]}</SelectItemText>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        id="brief-headline"
        label="Poster headline (optional)"
        hint="Left empty, posters use the destination and trip type."
      >
        <Input
          id="brief-headline"
          value={brief.headline}
          maxLength={LIMITS.headline}
          placeholder="e.g. Sunsets for two"
          onChange={(event) => update({ headline: event.target.value })}
        />
      </Field>

      <Field
        id="brief-highlights"
        label="Highlights"
        hint="Comma-separated. The first three go on the poster."
      >
        <textarea
          id="brief-highlights"
          rows={2}
          value={brief.highlights}
          maxLength={LIMITS.highlights}
          placeholder="Flights included, Private pool villa, Daily breakfast"
          onChange={(event) => update({ highlights: event.target.value })}
          className={TEXTAREA}
        />
      </Field>

      <Field
        id="brief-itinerary"
        label="Itinerary"
        hint="One line per day. Each line becomes an itinerary card."
      >
        <textarea
          id="brief-itinerary"
          rows={4}
          value={brief.itinerary}
          maxLength={LIMITS.itinerary}
          placeholder={
            "Day 1: Arrival and sunset cruise\nDay 2: Island hopping"
          }
          onChange={(event) => update({ itinerary: event.target.value })}
          className={TEXTAREA}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field id="brief-agency" label="Agency name">
          <Input
            id="brief-agency"
            value={brief.agencyName}
            maxLength={LIMITS.agencyName}
            placeholder="Your agency"
            onChange={(event) => update({ agencyName: event.target.value })}
          />
        </Field>
        <Field id="brief-contact" label="Contact or CTA">
          <Input
            id="brief-contact"
            value={brief.contact}
            maxLength={LIMITS.contact}
            placeholder="+1 555 0100"
            onChange={(event) => update({ contact: event.target.value })}
          />
        </Field>
      </div>
    </form>
  )
}

/* ── Formats ─────────────────────────────────────────────────────────────── */

function FormatGrid({ brief }: { brief: TripBrief }) {
  const { pricing } = useApp()
  const problem = briefProblem(brief)
  const formats = TRAVEL_FORMATS.filter(
    (format) => !pricing.disabled.includes(format.modelId)
  )
  return (
    <div className="flex flex-col gap-4">
      {problem ? (
        <p
          role="status"
          className="rounded-xl bg-surface px-4 py-3 text-sm text-muted-foreground"
        >
          {problem}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {formats.map((format) => (
          <FormatCard
            key={format.id}
            format={format}
            brief={brief}
            disabled={Boolean(problem)}
          />
        ))}
      </div>
    </div>
  )
}

function FormatCard({
  format,
  brief,
  disabled,
}: {
  format: TravelFormat
  brief: TripBrief
  disabled: boolean
}) {
  const router = useRouter()
  const { pricing } = useApp()
  const setModel = useDock((state) => state.setModel)
  const setPrompt = useDock((state) => state.setPrompt)
  const setPreset = useDock((state) => state.setPreset)
  const setMedia = useDock((state) => state.setMedia)
  const dockMedia = useDock((state) => state.surfaces[format.surface].media)
  const setSettings = useSettings((state) => state.set)
  const [dayIndex, setDayIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)

  const days = format.perDay ? itineraryDays(brief) : []
  const day = days[Math.min(dayIndex, Math.max(days.length - 1, 0))]
  const content: TravelContent | null = disabled
    ? null
    : buildContent(format, brief, day)
  const model = findModel(format.modelId)
  const quote = content
    ? tryPriceFor(
        content.modelId,
        content.settings,
        [],
        pricing.table,
        content.prompt
      )
    : null
  const Icon = format.surface === "video" ? Video : ImageIcon
  const facts = [
    model?.label,
    String(format.settings.aspectRatio ?? ""),
    typeof format.settings.duration === "number"
      ? `${format.settings.duration}s`
      : "",
  ].filter(Boolean)

  const open = () => {
    if (!content) return
    setModel(content.surface, content.modelId)
    setSettings(content.modelId, content.settings)
    setPreset(content.surface, undefined)
    setPrompt(content.surface, content.prompt)
    // A photo format keeps a start frame the agent already attached; others start clean.
    setMedia(
      content.surface,
      format.photo
        ? dockMedia.filter(
            (item) => item.role === "start" && item.kind !== "video"
          )
        : []
    )
    router.push(`/${content.surface}`)
  }

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-lime">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-muted-foreground">
          {format.channel}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">{format.title}</h3>
        <p className="text-sm text-muted-foreground">{format.description}</p>
      </div>
      <p className="text-xs text-muted-foreground">{facts.join(" · ")}</p>

      {format.photo ? (
        <p className="flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-2 text-xs text-foreground">
          <Camera className="size-3.5 shrink-0 text-lime" aria-hidden />
          Add a {format.photo.label.toLowerCase()} as the start frame in the
          next step.
        </p>
      ) : null}

      {format.perDay && days.length > 0 ? (
        <Select
          value={String(dayIndex)}
          onValueChange={(next) => next != null && setDayIndex(Number(next))}
        >
          <SelectTrigger
            size="sm"
            aria-label="Itinerary day"
            className="w-full"
          >
            <SelectValue>
              {() => (day ? `Day ${day.day}: ${day.title}` : "Choose a day")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent variant="picker" surface="solid">
            {days.map((item, index) => (
              <SelectItem key={`${item.day}-${index}`} value={String(index)}>
                <SelectItemText>
                  Day {item.day}: {item.title}
                </SelectItemText>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      {content ? (
        <div>
          <button
            type="button"
            aria-expanded={showPrompt}
            onClick={() => setShowPrompt((value) => !value)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                showPrompt && "rotate-180"
              )}
              aria-hidden
            />
            {showPrompt ? "Hide prompt" : "Show prompt"}
          </button>
          {showPrompt ? (
            <p className="mt-2 rounded-lg bg-surface p-2.5 text-xs leading-5 text-muted-foreground">
              {content.prompt}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
          {quote ? (
            <>
              <Sparkle className="size-3.5 fill-current" aria-hidden />
              <span aria-label={`${quote.credits} credits`}>
                {quote.credits}
              </span>
            </>
          ) : null}
        </span>
        <button
          type="button"
          onClick={open}
          disabled={!content}
          className="flex h-9 items-center gap-1.5 rounded-[10px] border border-white/15 bg-white/5 px-3 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  )
}
