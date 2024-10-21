const defaultTheme = require('tailwindcss/defaultTheme')
import daisyui from 'daisyui'
module.exports = {
    content: ['./src/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
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
    variants: {
        extend: {
            opacity: ['disabled'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('daisyui'), // Combine plugins here
        daisyui,
    ],
}
