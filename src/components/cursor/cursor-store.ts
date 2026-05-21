export type CursorState =
  | "default"
  | "pointer"
  | "loading"
  | "type"
  | "grab"
  | "grabbing"
  | "hidden"

export interface CursorStateOptions {
  label?: string
  x?: number
  y?: number
}

interface CursorStateEventDetail {
  state: CursorState
  options?: CursorStateOptions
}

const EVENT_NAME = "cursor-state-change"
const REINIT_EVENT_NAME = "cursor-reinit"

export function setCursorState(
  state: CursorState,
  options?: CursorStateOptions
) {
  console.log("[cursor-store] setCursorState", { state, options })
  window.dispatchEvent(
    new CustomEvent<CursorStateEventDetail>(EVENT_NAME, {
      detail: { state, options },
    })
  )
}

export function onCursorStateChange(
  handler: (detail: CursorStateEventDetail) => void
) {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<CursorStateEventDetail>).detail
    handler(detail)
  }

  window.addEventListener(EVENT_NAME, listener)

  return () => {
    window.removeEventListener(EVENT_NAME, listener)
  }
}

export function emitCursorReinit() {
  console.log("[cursor-store] emitCursorReinit")
  window.dispatchEvent(new CustomEvent(REINIT_EVENT_NAME))
}

export function onCursorReinit(handler: () => void) {
  window.addEventListener(REINIT_EVENT_NAME, handler)

  return () => {
    window.removeEventListener(REINIT_EVENT_NAME, handler)
  }
}
