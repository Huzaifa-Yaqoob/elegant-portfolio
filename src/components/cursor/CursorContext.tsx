"use client"
import React, { useState, type ReactNode } from "react"
import {
  CursorContext,
  type CursorVariant,
} from "@/components/cursor/useCursor.ts"
import CustomCursor from "@/components/cursor/CustomCursor"

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [variant, setVariant] = useState<CursorVariant>("default")
  const [cursorText, setCursorText] = useState("")

  return (
    <CursorContext.Provider
      value={{ variant, setVariant, cursorText, setCursorText }}
    >
      <CustomCursor />
      {children}
    </CursorContext.Provider>
  )
}
