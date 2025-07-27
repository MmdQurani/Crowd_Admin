/* eslint-disable no-undef */

/** @type {import('tailwindcss').Config} */
import colors from './src/asset/tailwind-config/js/colors';
module.exports = {
  content: [
    './src/**/*.js',
    './src/**/*.jsx',
    // Add paths to your CSS files here
    './src/asset/tailwind-config/css/*.css',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '4px',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
      large: '12px'
    },
    extend: {
      borderWidth: {
        DEFAULT: '1px'
      },
      boxShadow: {
        DEFAULT: '0 4px 10px 0 rgba(0,0,0,0.05)'
      },
      colors: colors,
      fontFamily: {
        IRANYekanX: ['IRANYekanXFaNum']
      },
      spacing: {
        '1/10': '10%',
        '9/10': '90%'
      }
    }
  },
  plugins: [require('flowbite/plugin')]
};
