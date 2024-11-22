const defaultTheme = require('tailwindcss/defaultTheme')
import daisyui from 'daisyui'

module.exports = {
    content: ['./src/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                lineSeed: ['LINESeedSansTH', 'sans-serif'],
            },
            fontWeight: {
                thin: 300,
                regular: 400,
                medium: 500,
                semibold: 700,
                bold: 800,
                heavy: 600,
            },
            keyframes: {
                'gradient-move': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
            },
            animation: {
                'gradient-move': 'gradient-move 5s ease infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwindcss-animate'),
        require('daisyui'),
    ],
}
