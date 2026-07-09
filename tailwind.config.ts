import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#3A2E27", // دکمه‌ها، متن اصلی
        latte: "#F4EFE8", // پس‌زمینه، متن روی دکمه
        sand: "#E7DFD2",
        clay: "#8B7355", // ساب‌تایتل‌ها، متن کم‌رنگ‌تر
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        farsi: ["var(--font-farsi)", "sans-serif"],
      },

      letterSpacing: {
        widest2: "0.35em",
      },
    },
  },
  plugins: [],
};
export default config;
