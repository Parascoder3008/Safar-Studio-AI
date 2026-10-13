import type { Metadata } from "next"

import { TravelStudio } from "@/components/travel/travel-studio"

export const metadata: Metadata = {
  title: "Travel Studio",
  description:
    "Write one trip brief and turn it into destination reels, hotel walkthroughs, package posters and itinerary cards.",
}

export default function TravelPage() {
  return <TravelStudio />
}
