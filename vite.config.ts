import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Vite configuration enabling Tailwind CSS JIT purge for faster startup and smaller bundles.
// This relies on Tailwind and autoprefixer being installed in the consuming project.
export default defineConfig({
  plugins: [solid()],
  css: {
    postcss: {
      plugins: [
        // Tailwind with explicit purge paths so only used classes remain
        require("tailwindcss")({
          purge: ["./src/**/*.{ts,tsx,html}"]
        }),
        // Vendor prefixes
        require("autoprefixer")(),
      ],
    },
  },
}); 