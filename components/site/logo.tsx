import Link from "next/link"

import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

/** SafarStudio AI mark: a lime tile with a paper plane. Placeholder until brand assets arrive. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="8" fill="#D1FE17" />
      <path d="M6.5 15.2 25.5 7.5l-5.6 17-5.3-5.6z" fill="#131517" />
      <path d="m14.6 18.9 10.9-11.4-8.3 13.3z" fill="#D1FE17" opacity="0.35" />
    </svg>
  )
}

export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      <LogoMark className={compact ? "size-6" : "size-8"} />
      <span
        className={cn(
          "font-display text-foreground",
          compact ? "text-base" : "text-lg"
        )}
      >
        {BRAND.name}
      </span>
    </Link>
  )
}
