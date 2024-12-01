/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        labelGreen: '#005747',
        hoverGreen: '#007058',
        borderGreen: '#69BFAE',
        lightGreen: 'rgba(0, 87, 71, 0.5)',
        lineGreen: 'rgba(0, 87, 71, 0.1)',
        lineTextGreen: 'rgba(0, 87, 71, 0.3)',
        whiteOpacity02: 'rgba(255, 255, 255, 0.2)',
      },
      backgroundImage: {
        'og-gradient': 'linear-gradient(to right, #0FA59B, #904DAC)',
        'login-gradient': 'linear-gradient(to bottom, #69BFAE, #AAC9C7)',
        'auth-gradient': 'linear-gradient(to bottom, #80C8B9, #BFE3DC, #FFFFFF)',
      },
    },
  },
  plugins: [],
}
