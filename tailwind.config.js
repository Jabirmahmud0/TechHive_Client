/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00FFFF', // Electric Blue / Cyan (Dark Mode)
                    light: '#0080FF',   // Electric Blue (Light Mode)
                },
                secondary: {
                    DEFAULT: '#39FF14', // Neon Green (Dark Mode)
                    light: '#008080',   // Teal (Light Mode)
                },
                dark: {
                    DEFAULT: '#0A0A0A', // Deep Black (Dark Mode)
                    light: '#FFFFFF',   // Pure White (Light Mode)
                },
                surface: {
                    DEFAULT: '#1A1A1A', // Dark Slate Gray (Dark Mode)
                    light: '#F5F5F5',   // Off-White (Light Mode)
                },
                text: {
                    primary: {
                        DEFAULT: '#FFFFFF', // Pure White (Dark Mode)
                        light: '#1A1A1A',   // Deep Black (Light Mode)
                    },
                    secondary: {
                        DEFAULT: '#A0A0A0', // Gray (Dark Mode)
                        light: '#666666',   // Medium Gray (Light Mode)
                    }
                },
                error: {
                    DEFAULT: '#FF4136', // Bright Red (Dark Mode)
                    light: '#CC0000',   // Dark Red (Light Mode)
                },
                success: {
                    DEFAULT: '#2ECC40', // Emerald Green (Dark Mode)
                    light: '#006400',   // Forest Green (Light Mode)
                }
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
            }
        },
    },
    plugins: [],
}