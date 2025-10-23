import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Använd den port som står i .env
            "/api": "http://localhost:10000/",
        },
    },
});
