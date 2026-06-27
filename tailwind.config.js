/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5FB8A5",
        "primary-soft": "#DDF4EE",
        "primary-deep": "#2F8F83",
        gold: "#D9B86C",
        "gold-soft": "#F7EFD8",
        silver: "#BFC6CE",
        "silver-soft": "#F3F5F7",
        cash: "#8ECFC1",
        background: "#F9FCFB",
        surface: "#FFFFFF",
        border: "#E6F0EC",
        text: "#1F2937",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 8px 28px rgba(47, 143, 131, 0.08)",
        glow: "0 12px 36px rgba(95, 184, 165, 0.16)",
      },
    },
  },
  plugins: [],
};
