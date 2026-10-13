import { create } from "zustand"
import { persist } from "zustand/middleware"

import { browserStorage } from "@/generation/stores/browser-storage"

import { EMPTY_BRIEF, type TripBrief } from "./brief"

/**
 * The agent's current trip brief, kept in localStorage so it survives reloads
 * and the trip to the generator and back.
 */
type BriefState = {
  brief: TripBrief
  update: (patch: Partial<TripBrief>) => void
  reset: () => void
}

export const useTripBrief = create<BriefState>()(
  persist(
    (set) => ({
      brief: EMPTY_BRIEF,
      update: (patch) =>
        set((state) => ({ brief: { ...state.brief, ...patch } })),
      reset: () => set({ brief: EMPTY_BRIEF }),
    }),
    {
      name: "safarstudio.brief.v1",
      storage: browserStorage(),
      partialize: (state) => ({ brief: state.brief }),
      // Fields added in later versions fall back to their defaults.
      merge: (persisted, current) => ({
        ...current,
        brief: {
          ...EMPTY_BRIEF,
          ...((persisted as { brief?: Partial<TripBrief> } | undefined)
            ?.brief ?? {}),
        },
      }),
    }
  )
)
