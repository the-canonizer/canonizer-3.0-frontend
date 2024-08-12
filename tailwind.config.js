/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: '"Inter", sans-serif',
    },
    extend: {
      boxShadow: {
        "camp-light": "0 10px 20px 0px rgba(49, 80, 114, 0.2)",
        "mobile-b-shadow": " 0px 10px 10px 0px rgba(0, 0, 0, 0.1)",
        "text-none": "none",
        "filter-shadow": " 0px 10px 20px 0px rgba(0, 0, 0, 0.25)",
      },
      width: {
        "search-dropdown-width": "875px", // Adding a custom width value with a specific size
      },

      fontSize: {
        24: "24px",
        13: "13px",
        32: "32px",
      },
      borderWidth: {
        3: "3px", // Custom border width
        5: "5px", // Another custom border width
        10: "10px", // Yet another custom border width
        6: "6px", // Yet another custom border width
      },
    
      colors: {
        canBlue: "#5482C8",
        canBlue_Opacity20: "#5482C833",
        canHoverBlue: "#326DC7",
        canGreen: "#4EB966",
        canGreen2: "#2EAD4A4D",
        canRed: "#E46B6B",
        canRed_Opacity10: "#E46B6B1A",
        canBlack: "#242B37",
        canOrange: "#F19C39",
        canDisabled: "#AAB2BF",
        canGray: "#F7F8FC",
        canGrey1: "#F4F5FA",
        canGrey1_Opacity70: "#F4F5FAB2",
        canGrey2: "#CCD4E7",
        canGrey3: "#696E78",
        canLight: "#777F93",
        canBlue2: "#D0D8F4",
        canLightRed: "#F4E5E5",
        canLightBlue: "#E1EDFE",
        canDarkBlack: "#000000",
        canLightGrey: "#F0F2FA",
        canLightBlack: "#69748B",
        canLightBg: "#E4E7EF",
        canLightgrey4: "#DDE2EE",
        canDarkRed: "#DB4F4F"
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        "topic-card-gr": "linear-gradient(158.22deg, #FFFFFF 0%, #F7F8FC 100%)",
      },
      keyframes: {
        rightToLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        rightToLeft: "rightToLeft 0.7s linear",
      },
      screens: {
        sm: "576px",
        // => @media (min-width: 576px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }
        tab: "1050px",

        lg: "992px",
        // => @media (min-width: 992px) { ... }

        xl: "1200px",
        // => @media (min-width: 1200px) { ... }

        "2xl": "1600px",
        // => @media (min-width: 1600px) { ... }

        "3xl": "1900px",
        // => @media (min-width: 1600px) { ... }
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
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-none": {
          textShadow: "none",
        },
      });
    },
  ],
};
