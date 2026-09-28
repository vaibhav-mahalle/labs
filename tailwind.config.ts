import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        surface: "#0c0c0e",
        border: "#27272a",
        muted: "#a1a1aa",
        body: "#e5e7eb",
        accent: "#34d399",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
export default config;
