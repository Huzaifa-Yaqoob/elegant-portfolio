// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://huzaifa.dev",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        webp: {
          quality: 85,
          effort: 6,
          alphaQuality: 80,
          nearLossless: true,
        },
        avif: {
          quality: 70,
          effort: 9,
          chromaSubsampling: "4:2:0",
        },
        jpeg: {
          mozjpeg: true,
          quality: 85,
          progressive: true,
        },
        png: {
          compressionLevel: 9,
          palette: true,
        },
      },
    },
  },
  vite: {
    // Astro and @tailwindcss/vite can resolve different Vite type instances.
    // Runtime is fine; this cast avoids the cross-package type identity error.
    // @ts-expect-error vite plugin type identity mismatch between Astro-bundled Vite and root Vite
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client"],
    },
  },
  integrations: [
    mdx(),
    react(),
    sitemap(),
    (await import("@playform/compress")).default({
      Image: {
        sharp: {
          webp: { effort: 6, nearLossless: true, quality: 85 },
          avif: { effort: 9, quality: 70 },
          jpeg: { mozjpeg: true, quality: 85, progressive: true },
          png: { compressionLevel: 9, palette: true },
          gif: { effort: 10 },
        },
      },
      SVG: {
        svgo: {
          multipass: true,
          plugins: ["preset-default"],
        },
      },
      JavaScript: true,
      CSS: true,
      HTML: true,
    }),
  ],
})
