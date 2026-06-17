import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0F14",
        surface: "#111827",
        elevated: "#1E293B",
        primary: "#3882F6",
        indigo: "#818CF8",
        cyan: "#22D3EE",
        text: "#F8FAFC",
        muted: "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 48px rgba(56, 130, 246, 0.22)",
        cyan: "0 0 42px rgba(34, 211, 238, 0.22)"
      },
      backgroundImage: {
        "valtis-grid": "linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: [typography]
};

export default config;
