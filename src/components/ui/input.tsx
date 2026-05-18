import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "peer h-14 w-full min-w-0 rounded-none border-0 border-b-2 border-surface-variant bg-transparent px-0 pt-6 pb-2 text-base text-on-surface transition-[color,border-color] outline-none placeholder:text-transparent focus-visible:border-on-surface disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-lg dark:aria-invalid:border-b-destructive/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
