import { useState } from "react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { buttonVariants } from "@/lib/button-variants"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  links: { label: string; href: string }[]
  cta: { label: string; href: string }
  personal: { email: string; phone: string }
  currentPath: string
}

const normalizePath = (path: string) => {
  if (!path) return "/"
  const withoutTrailing = path.replace(/\/+$/, "")
  return withoutTrailing === "" ? "/" : withoutTrailing
}

const isLinkActive = (href: string, currentPath: string) =>
  normalizePath(href) === normalizePath(currentPath)

export default function MobileNav({
  links,
  cta,
  personal,
  currentPath,
}: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        aria-label="Toggle Menu"
      >
        <span
          className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${
            open ? "translate-y-[8px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${
            open ? "scale-x-0 opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-foreground transition-all duration-300 ${
            open ? "-translate-y-[8px] -rotate-45" : ""
          }`}
        />
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="border-surface-variant bg-background">
          <div className="flex flex-col overflow-y-auto px-8 py-12">
            <nav className="flex flex-col gap-6">
              {links.map((link: { label: string; href: string }) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="h1-style text-foreground uppercase transition-colors hover:bg-transparent hover:text-primary"
                >
                  <span>
                    {isLinkActive(link.href, currentPath)
                      ? `[${link.label}]`
                      : link.label}
                  </span>
                </a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-10 pt-12">
              <a
                href={cta.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full border-2 border-on-surface bg-on-surface py-10 text-xl font-bold tracking-widest text-background hover:bg-secondary hover:text-on-secondary"
                )}
              >
                {cta.label}
              </a>
              <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-10 sm:grid-cols-2">
                <div>
                  <p className="label-caps-style mb-3 text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${personal.email}`}
                    className="h3-style font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {personal.email}
                  </a>
                </div>
                <div>
                  <p className="label-caps-style mb-3 text-muted-foreground">
                    Connect
                  </p>
                  <a
                    href={`tel:${personal.phone}`}
                    className="h3-style font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {personal.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
