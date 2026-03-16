// @ts-check
import { defineConfig } from "astro/config";

// Build into /docs so GitHub Pages can serve the site when "Publish from branch" → docs folder.
// All assets (_astro, images, etc.) will live under docs/ and be served at the site root.
export default defineConfig({
  site: "https://paywithquick.co.uk",
  base: "/",
  output: "static",
  trailingSlash: "always",
  outDir: "docs",
  build: {
    assets: "_astro",
  },
});
