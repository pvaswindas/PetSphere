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
        lightTextGrey: '#B9B9B9',
        lineGreen: 'rgba(0, 87, 71, 0.1)',
        lineTextGreen: 'rgba(0, 87, 71, 0.3)',
        whiteOpacity02: 'rgba(255, 255, 255, 0.2)',
        whiteOpacity05: 'rgba(255, 255, 255, 0.5)',
        blackOpacity85: 'rgba(0, 0, 0, 0.85)',
        blackOpacity30: 'rgba(0, 0, 0, 0.3)',
        blackOpacity40: 'rgba(0, 0, 0, 0.4)',
        lightTextGreyOpacity10: 'rgba(185, 185, 185, 0.1)',
        lightTextGreyOpacity20: 'rgba(185, 185, 185, 0.2)',
        lightTextGreyOpacity30: 'rgba(185, 185, 185, 0.3)',
        dimGray: '#626262',
        deepOceanBlue: '#2959A1',
        midnightBlue: '#08244E',
        softSkyBlue: '#ECF4FF',
        pastelBlue: '#89ABE1'
      },
      backgroundImage: {
        'og-gradient': 'linear-gradient(to right, #0FA59B, #904DAC)',
        'og-gradient-light': 'linear-gradient(to right, #4ed2b3, #af7dc4)',
        'og-gradient-dark': 'linear-gradient(to right, #0b8a74, #6e1a64)',
        'og-gradient-opp': 'linear-gradient(to left, #0FA59B, #904DAC)',
        'login-gradient': 'linear-gradient(to bottom, #69BFAE, #AAC9C7)',
        'auth-gradient': 'linear-gradient(to bottom, #80C8B9, #BFE3DC, #FFFFFF)',
        'btn-primary-gradient': 'linear-gradient(to right, #0FA59B, #42B69B)',
        'btn-secondary-gradient': 'linear-gradient(to right, #904DAC, #C76CC3)',
        'btn-hover-primary-gradient': 'linear-gradient(to right, #42B69B, #68C3A7)',
        'btn-hover-secondary-gradient': 'linear-gradient(to right, #C76CC3, #E294D5)',
        'btn-disabled-gradient': 'linear-gradient(to right, #B2B2B2, #E0E0E0)',
        'deep-ocean-blue-gradient': 'linear-gradient(to bottom, #1153B4, #1151B1, #1150AE, #104DA8, #0F479B, #0C3B81, #08244E)',
        'deep-ocean-blue-gradient-end': 'linear-gradient(to right, #1153B4, #1151B1, #1150AE, #104DA8, #0F479B, #0C3B81, #08244E)',
      },
    },
  },
  plugins: [],
}
