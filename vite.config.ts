import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { minifyTemplateLiterals } from "rollup-plugin-minify-template-literals";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [tailwindcss(), minifyTemplateLiterals(), cloudflare()],
});