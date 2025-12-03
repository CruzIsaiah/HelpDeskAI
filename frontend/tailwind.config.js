module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "app-shell",
    "app-header",
    "app-title",
    "app-subtitle",
    "app-font",
    "card",
    "card-strong",
    "btn",
    "btn-primary",
    "btn-ghost",
    "section-title",
    "prose",
  ],
  plugins: [],
};
