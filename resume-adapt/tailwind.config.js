/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-tint": "#b52701",
        "surface-container-lowest": "#ffffff",
        "surface-bright": "#fffdf9",
        "surface-container-low": "#faf7f2",
        "surface": "#fffdfa",
        "surface-container": "#f7f3ec",
        "surface-container-high": "#eee8de",
        "surface-container-highest": "#e5ded2",
        "background": "#fffdfa",
        "on-surface": "#18181b",
        "on-surface-variant": "#57534e",
        "outline": "#d6cec2",
        "outline-variant": "#ece5d8",
        "primary": "#ff5c35",
        "primary-container": "#ff5c35",
        "primary-fixed": "#ffe2da",
        "primary-fixed-dim": "#ffb4a3",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",
        "secondary": "#2563eb",
        "secondary-container": "#dbeafe",
        "on-secondary": "#ffffff",
        "tertiary": "#059669",
        "tertiary-container": "#d1fae5",
        "on-tertiary": "#ffffff",
        "accent-yellow": "#fbbf24",
        "accent-yellow-light": "#fef3c7",
        "error": "#e11d48",
        "error-container": "#ffe4e6",
        "on-error": "#ffffff"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        'body-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-xl': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'code-sm': ['"JetBrains Mono"', 'monospace'],
        'label-caps': ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        'DEFAULT': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        'full': '9999px'
      }
    },
  },
  plugins: [],
}
