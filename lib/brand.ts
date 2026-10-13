/** Public brand constants, safe for client and server. */
export const BRAND = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "SafarStudio AI",
  tagline: "AI content studio for travel brands",
  description:
    "SafarStudio AI turns destination photos and a one-line brief into reels, ads and listing visuals for travel agencies and tour operators. Every frontier image and video model, one credit balance, one library.",
  productionUrl: "https://safarstudio.ai",
  supportEmail: "support@safarstudio.ai",
  /** Dismissible promo bar above the nav; empty string hides it. */
  promo: process.env.NEXT_PUBLIC_PROMO_BAR ?? "",
  promoHref: process.env.NEXT_PUBLIC_PROMO_HREF ?? "/pricing",
} as const
