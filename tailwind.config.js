// tailwind.config.js

module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.js", "./src/App.js"],
  },
  theme: {},
  variants: {
    margin: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
