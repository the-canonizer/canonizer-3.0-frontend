/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "3xlMin": { min: "1600px" },
      "2xl": { max: "1536px" },
      "1xl": { max: "1450px" },
      xl: { max: "1280px" },
      lg: { max: "1024px" },
      md: { max: "992px" },
      sm: { max: "768px" },
      xsm: { max: "640px" },
    },
    fontFamily: {
      inter: '"Inter", sans-serif',
    },
    fontSize: {
      sm: "0.8rem",
      12: "12px",
      14: "14px",
      base: "16px",
      medium: "20px",
      large: "32px",
      xl: "50px",
      "2xl": "60px",
    },
    lineHeight: {
      22: "22px",
      26: "26px",
      null: "0px",
    },
    opacity: {
      0: "0",
      20: "0.2",
      40: "0.4",
      60: "0.6",
      80: "0.8",
      100: "1",
    },
    backgroundSize: ({ theme }) => ({
      auto: "auto",
      cover: "cover",
      contain: "contain",
      ...theme("spacing"),
    }),
    extend: {
      spacing: {
        1: "8px",
        2: "12px",
        3: "16px",
        4: "24px",
        5: "32px",
        6: "48px",
      },
      colors: {
        blue: "#5482C8",
        hblue: "#326DC7",
        green: "#4EB966",
        red: "#E46B6B",
        black: "#242B37",
        orange: "#F19C39",
        transparent: "transparent",
        white: "#fff",
        disabled: "#AAB2BF",
        gr: "#F7F8FC",
        light: "#777F93",
        greyBg: "#F4F5FA",
      },
      borderRadius: {
        10: "10px",
        none: "0",
        sm: ".125rem",
        DEFAULT: ".25rem",
        lg: ".5rem",
        full: "9999px",
      },
      screens: {
        "3xl": "1600px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".content-auto": {
          "content-visibility": "auto",
        },
        ".content-hidden": {
          "content-visibility": "hidden",
        },
        ".content-visible": {
          "content-visibility": "visible",
        },
      });
    }),
    plugin(function ({ addVariant }) {
      addVariant("optional", "&:optional");
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("inverted-colors", "@media (inverted-colors: inverted)");
    }),
  ],
};
