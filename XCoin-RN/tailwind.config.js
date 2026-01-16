/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const { colors } = require("./src/constants/colors");

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
            colors,
        },
    },

    plugins: [
        plugin(({ addUtilities }) => {
            addUtilities(buildTypographyUtilities());
        }),
    ],
};
