import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "peer no-scrollbar flex min-h-36 w-full resize-none rounded-none border-0 border-b-2 border-surface-variant bg-transparent px-0 pt-8 pb-2 text-base text-on-surface transition-[color,border-color] outline-none placeholder:text-transparent focus-visible:border-on-surface disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-lg dark:aria-invalid:border-b-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
