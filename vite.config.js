import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify("http://test-base"),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
  },
});
