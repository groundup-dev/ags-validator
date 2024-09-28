import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Light cream and dark mode
        foreground: "var(--foreground)", // Darker text color and light mode text
        card: {
          DEFAULT: "var(--card)", // White for cards
          foreground: "var(--card-foreground)", // Darker text color for cards
        },
        popover: {
          DEFAULT: "var(--popover)", // White for popovers
          foreground: "var(--popover-foreground)", // Darker text color for popovers
        },
        primary: {
          DEFAULT: "var(--primary)", // Dark green
          foreground: "var(--primary-foreground)", // White
        },
        secondary: {
          DEFAULT: "var(--secondary)", // Light brown
          foreground: "var(--secondary-foreground)", // Darker text color for secondary
        },
        muted: {
          DEFAULT: "var(--muted)", // Muted light brown
          foreground: "var(--muted-foreground)", // Darker muted text
        },
        accent: {
          DEFAULT: "var(--accent)", // Light green
          foreground: "var(--accent-foreground)", // Darker text color
        },
        destructive: {
          DEFAULT: "var(--destructive)", // Dark red
          foreground: "var(--destructive-foreground)", // White
        },
        border: "var(--border)", // Muted brown
        input: "var(--input)", // Same as border
        ring: "var(--ring)", // Dark brown
        chart: {
          "1": "var(--chart-1)", // Dark green
          "2": "var(--chart-2)", // Light brown
          "3": "var(--chart-3)", // Dark brown
          "4": "var(--chart-4)", // Light green
          "5": "var(--chart-5)", // Dark red
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Consistent with CSS variable
        md: "calc(var(--radius) - 2px)", // Adjusted for consistency
        sm: "calc(var(--radius) - 4px)", // Adjusted for consistency
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
