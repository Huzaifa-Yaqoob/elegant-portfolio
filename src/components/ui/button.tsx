import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/lib/button-variants.ts"
import { useMagnetic } from "@/hooks/use-magnetic"

import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  magnetic = false,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { magnetic?: boolean }) {
  const { ref: magneticRef } = useMagnetic({ enabled: magnetic })

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={magneticRef}
      {...props}
    />
  )
}

export { Button }
