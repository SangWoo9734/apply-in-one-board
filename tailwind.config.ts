import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          100: '#32c87b',
          200: '#5ad494',
          300: '#d4ffec',
        },
        // Accent
        accent: {
          100: '#6dd89f',
          200: '#28a566',
        },
        // Text
        text: {
          100: '#ffffff',
          200: '#e0e0e0',
          300: '#a0a0a0',
        },
        // Background
        bg: {
          100: '#1e1e1e',
          200: '#2d2d2d',
          300: '#454545',
          400: '#1a1a1a',
        },
        // Status
        status: {
          interested: '#6dd89f',
          preparing: '#4a9eff',
          applied: '#32c87b',
          'document-passed': '#7b68ee',
          interview: '#ff8c42',
          accepted: '#32c87b',
          rejected: '#757575',
        },
        // Semantic
        success: '#32c87b',
        error: '#ef5350',
        warning: '#ffa726',
        info: '#42a5f5',
      },
      fontFamily: {
        primary: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        brand: ['RixInuaridurine', 'sans-serif'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px rgba(50, 200, 123, 0.2)',
        toast: '0 4px 12px rgba(0, 0, 0, 0.4)',
        dragging: '0 8px 20px rgba(50, 200, 123, 0.4)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
