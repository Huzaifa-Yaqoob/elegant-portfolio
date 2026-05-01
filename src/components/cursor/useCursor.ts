import { createContext, useContext } from "react"

export type CursorVariant = "default" | "project" | "button" | "text" | "hidden"

export interface CursorContextType {
  variant: CursorVariant
  setVariant: (variant: CursorVariant) => void
  cursorText: string
  setCursorText: (text: string) => void
}

export const CursorContext = createContext<CursorContextType | undefined>(
  undefined
)

export const useCursor = () => {
  const context = useContext(CursorContext)
  if (!context)
    throw new Error("useCursor must be used within a CursorProvider")
  return context
}
