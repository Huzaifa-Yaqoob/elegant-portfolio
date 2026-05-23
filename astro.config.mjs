// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://huzaifa.dev",
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
  integrations: [react(), sitemap()],
})
