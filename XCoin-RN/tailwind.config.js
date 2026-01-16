/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const WEIGHTS = {
  thin: "Roboto-Thin",
  extralight: "Roboto-ExtraLight",
  light: "Roboto-Light",
  regular: "Roboto-Regular",
  medium: "Roboto-Medium",
  semibold: "Roboto-SemiBold",
  bold: "Roboto-Bold",
  extrabold: "Roboto-ExtraBold",
  black: "Roboto-Black",
};

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 42, 48];

function buildTypographyUtilities() {
  const u = {};

  for (const [key, family] of Object.entries(WEIGHTS)) {
    for (const size of SIZES) {
      u[`.${key}${size}`] = {
        fontFamily: family,
        fontSize: `${size}px`,
      };

      const italicFamily = key === "regular" ? "Roboto-Italic" : `${family}Italic`;
      u[`.${key}Italic${size}`] = {
        fontFamily: italicFamily,
        fontSize: `${size}px`,
      };
    }
  }

  return u;
}

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  safelist: [
    {
      pattern:
        /(thin|extralight|light|regular|medium|semibold|bold|extrabold|black)(Italic)?(12|14|16|18|20|24|28|32|42|48)/,
    },
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f3460",
          dark: "#0a2342",
          light: "#1a4d8f",
        },
        secondary: {
          DEFAULT: "#1a1a2e",
          dark: "#0f0f1a",
          light: "#2d2d44",
        },
        accent: {
          DEFAULT: "#e94560",
          dark: "#c93850",
          light: "#ff6b85",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#1a1a2e",
          gray: "#f5f5f5",
        },
        text: {
          DEFAULT: "#333333",
          light: "#888888",
          dark: "#000000",
          white: "#ffffff",
        },

      },
    },
  },

  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(buildTypographyUtilities());
    }),
  ],
};
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f3460',
                    dark: '#0a2342',
                    light: '#1a4d8f',
                },
                secondary: {
                    DEFAULT: '#1a1a2e',
                    dark: '#0f0f1a',
                    light: '#2d2d44',
                },
                accent: {
                    DEFAULT: '#e94560',
                    dark: '#c93850',
                    light: '#ff6b85',
                },
                background: {
                    DEFAULT: '#ffffff',
                    dark: '#1a1a2e',
                    gray: '#f5f5f5',
                },
                text: {
                    DEFAULT: '#333333',
                    light: '#888888',
                    dark: '#000000',
                    white: '#ffffff',
                },
                primaryBlue: {
                    DEFAULT: '#0063F5',
                },
            },
        },
    },
    plugins: [],
}
