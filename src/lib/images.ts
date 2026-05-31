import type { ImageMetadata } from "astro"

type ImageModule = { default: ImageMetadata }

const imageModules = import.meta.glob<ImageModule>(
  "/src/assets/images/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true }
)

const registry = new Map<string, ImageMetadata>()

for (const [absolutePath, mod] of Object.entries(imageModules)) {
  const key = absolutePath.replace("/src/assets/images", "")
  registry.set(key, mod.default)
}

export function resolveImage(
  path: string | null | undefined
): ImageMetadata | undefined {
  if (!path) return undefined
  return registry.get(path)
}

export function getResolvedSrc(
  path: string | null | undefined,
  fallback?: string
): string {
  const img = resolveImage(path)
  if (img) return img.src
  return fallback ?? path ?? ""
}
