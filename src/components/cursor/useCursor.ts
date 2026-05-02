import { useSyncExternalStore } from "react"

export type CursorVariant = "default" | "form" | "button" | "text" | "hidden"

/**
 * Singleton state to share cursor data across Astro islands
 */
let state = {
  variant: "default" as CursorVariant,
  cursorText: "",
}

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => state

export const useCursor = () => {
  const { variant, cursorText } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  const setVariant = (v: CursorVariant) => {
    state = { ...state, variant: v }
    listeners.forEach((l) => l())
  }

  const setCursorText = (t: string) => {
    state = { ...state, cursorText: t }
    listeners.forEach((l) => l())
  }

  return { variant, cursorText, setVariant, setCursorText }
}
