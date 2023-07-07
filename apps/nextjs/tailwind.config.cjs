/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [require("@acme/tailwind-config")],
  theme: {
    extend: {
      colors: {
        midnight: "#282a36",
        offwhite: "#f6f6f0",
        lilac: "#bc93f9",
        navy: "#6273a4",
        red: "#ff5655",
      },
    },
  },
};
