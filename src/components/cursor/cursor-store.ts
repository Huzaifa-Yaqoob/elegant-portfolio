export type CursorState = "default" | "loading" | "type" | "hidden"

export interface CursorStateOptions {
  label?: string
}

interface CursorStateEventDetail {
  state: CursorState
  options?: CursorStateOptions
}

const EVENT_NAME = "cursor-state-change"

export function setCursorState(
  state: CursorState,
  options?: CursorStateOptions
) {
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
