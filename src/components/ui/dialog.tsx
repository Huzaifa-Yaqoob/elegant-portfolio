import * as React from "react"
import { useEffect, useRef } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { gsap } from "@/lib/gsap"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

const DialogContext = React.createContext<{ actionsRef: React.RefObject<DialogPrimitive.Root.Actions | null> } | null>(null)

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  const actionsRef = useRef<DialogPrimitive.Root.Actions | null>(null)
  return (
    <DialogContext.Provider value={{ actionsRef }}>
      <DialogPrimitive.Root data-slot="dialog" actionsRef={actionsRef} {...props} />
    </DialogContext.Provider>
  )
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  DialogPrimitive.Backdrop.Props
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Backdrop
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-background/40 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const context = React.useContext(DialogContext)
  const actionsRef = context?.actionsRef

  useEffect(() => {
    const card = cardRef.current
    const overlay = overlayRef.current
    if (!card || !overlay) return

    const ctx = gsap.context(() => {
      gsap.set(card, { scale: 0.92, opacity: 0, y: 20 })
      gsap.set(overlay, { opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.to(overlay, { opacity: 1, duration: 0.2 })
      tl.to(
        card,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.6)",
        },
        "-=0.08"
      )
    })

    let isExiting = false

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes") {
          const isExitState =
            overlay.hasAttribute("data-ending-style") ||
            overlay.hasAttribute("data-closed") ||
            (m.attributeName === "data-open" && overlay.dataset.open === undefined)

          if (isExitState) {
            if (!isExiting) {
              isExiting = true
              gsap.to([card, overlay], {
                opacity: 0,
                scale: 0.96,
                y: 10,
                duration: 0.15,
                ease: "power2.in",
                onComplete: () => {
                  actionsRef?.current?.unmount()
                  ctx.revert()
                },
              })
            }
          }
        }
      }
    })

    observer.observe(overlay, {
      attributes: true,
      attributeFilter: ["data-ending-style", "data-closed", "data-open", "data-state"],
    })

    return () => {
      ctx.revert()
      observer.disconnect()
    }
  }, [actionsRef])

  return (
    <DialogPortal>
      <DialogOverlay ref={overlayRef} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none"
        {...props}
      >
        <div
          ref={cardRef}
          className={cn(
            "relative grid w-full max-w-[calc(100vw-2rem)] gap-6 rounded-none bg-background p-8 text-sm text-foreground shadow-md ring-1 ring-foreground/10 sm:max-w-lg",
            className
          )}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-5 right-5"
                  size="icon-sm"
                />
              }
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </div>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-lg leading-none font-semibold tracking-wider uppercase",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "mt-0.5 text-sm leading-relaxed text-outline *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
