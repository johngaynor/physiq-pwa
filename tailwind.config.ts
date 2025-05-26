// tailwind.config.ts
import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // REQUIRED for toggling themes
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
