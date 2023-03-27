import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
    proxy: {
      "/*": "http://localhost:3000",
    },
  },
  plugins: [react(), viteTsconfigPaths()],
});
