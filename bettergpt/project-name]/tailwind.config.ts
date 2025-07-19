import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', 
    './docs/**/*.{md}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2',
        secondary: '#14171A',
        accent: '#F5F8FA',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['visited'],
    },
  },
  plugins: [],
};

export default config;