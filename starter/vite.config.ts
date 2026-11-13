import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // StyleX runs first so it can compile styles before React transforms the file.
  plugins: [stylex.vite({ useCSSLayers: false }), react()],
});
