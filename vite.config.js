import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "/scanner/",
    plugins: [
        react()
    ],
    build: {
        rollupOptions: {
            external: ["react-dom/client"],
        },
    },
});
