import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0D0D12",
        graphite: "#2A2A35",
        ivory: "#FAF8F5",
        champagne: "#C9A84C",
        "champagne-dark": "#b0913e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      borderRadius: {
        'md': '6px',
        'lg': '10px',
      }
    },
  },
  plugins: [],
};
export default config;
