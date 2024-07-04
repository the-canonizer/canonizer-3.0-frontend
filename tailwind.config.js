/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: '"Inter", sans-serif',
    },
    extend: {
      colors: {
        canBlue: "#5482C8",
        canHoverBlue: "#326DC7",
        canGreen: "#4EB966",
        canGreen2: "#2EAD4A4D",
        canRed: "#E46B6B",
        canBlack: "#242B37",
        canOrange: "#F19C39",
        canDisabled: "#AAB2BF",
        canGray: "#F7F8FC",
        canGrey1: "#F4F5FA",
        canGrey2: "#CCD4E7",
        canGrey3: "#696E78",
        canLight: "#777F93",
        canBlue2: "#D0D8F4",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwind-scrollbar")({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
    plugin(function ({ addVariant }) {
      addVariant("optional", "&:optional");
      addVariant("hocus", ["&:hover", "&:focus"]);
      addVariant("inverted-colors", "@media (inverted-colors: inverted)");
    }),
  ],
};
