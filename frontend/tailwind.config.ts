import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { xl: "16px", "2xl": "20px" },
      colors: {
        brand: { DEFAULT: "#4F46E5", lite: "#EEF2FF" },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04)",
      },
    },
  },
  plugins: [],
};

export default config;
