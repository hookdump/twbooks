import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Twitter's exact color palette
        'twitter-blue': '#1DA1F2',
        'twitter-blue-hover': '#1A8CD8',
        'twitter-blue-light': '#E7F3FF',
        'twitter-black': '#0F1419',
        'twitter-gray': {
          50: '#F7F9FA',
          100: '#E1E8ED', 
          200: '#AAB8C2',
          300: '#657786',
          400: '#536471',
          500: '#5B7083',
          600: '#1C2938',
          700: '#14171A',
          800: '#10141A',
          900: '#000000'
        },
        // Dark mode colors (Twitter's dark theme)
        'dark': {
          'bg': '#000000',
          'secondary': '#16181C', 
          'hover': '#1D1F23',
          'border': '#2F3336',
          'text': '#E7E9EA',
          'text-secondary': '#71767B',
          'text-muted': '#536471'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system', 
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Ubuntu',
          '"Helvetica Neue"',
          'sans-serif'
        ],
      },
      width: {
        '275': '275px',
        '350': '350px'
      },
      maxWidth: {
        'twitter': '600px'
      },
      fontSize: {
        '13': ['13px', '16px'],
        '15': ['15px', '20px'],
        '17': ['17px', '24px'],
        '19': ['19px', '24px']
      },
      spacing: {
        '15': '60px',
        '18': '72px'
      },
      borderRadius: {
        'twitter': '9999px'
      }
    },
  },
  plugins: [],
}

export default config