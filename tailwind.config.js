const { fontFamily } = require('tailwindcss/defaultTheme')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        BrutalBlue1 : "#38dbff",
        BrutalOrange1 : "#ffb443",
        BrutalRed1 : "#ff5d5d",
        BrutalYellow1 : "#fff503",
        BrutalGreen1 : "#00ff75",
        BrutalPurple1 : "#dd7dff",
        BrutalBlack1 : "#000000",

        BgBrutalSkin1: "#FFDCA8",
        // BgBrutalSkin1: "#F5F2DA",
        BrutalAqua1: "#15FDD3",
        BrutalPurple2: "#C83FD3",
        BrutalGreen2: "#11EA50",

        BgSecondaryBrutalSkin1: "#FFE5C0",
        // BgSecondaryBrutalSkin1: "#FCF5EB"
        // BgSecondaryBrutalSkin1: "#FFFFFF"


        BrutalWhite: "#FFFFFF",

        fakeBlackNeu: "#2c2b2b"

      },

      fontFamily: {
        Overpass: "Overpass, arial",
        BebasNeue : "Bebas Neue, arial",
        InriaSans: 'Inria Sans, cursive',
        
        Roboto: 'Roboto, cursive'
      },

    },
  },
  safelist: [
    {
      pattern: /(bg|text|border)-BrutalBlue1/,    
    },
    {
      pattern: /(bg|text|border)-BrutalOrange1/,
    },
    {
      pattern: /(bg|text|border)-BrutalRed1/,
    },
    {
      pattern: /(bg|text|border)-BrutalYellow1/,
    },
    {
      pattern: /(bg|text|border)-BrutalGreen1/,
    },
    {
      pattern: /(bg|text|border)-BrutalPurple1/,
    },
    {
      pattern: /(bg|text|border)-BrutalBlack1/,
    },

    ,
    {
      pattern: /(bg|text|border)-BgBrutalSkin1/,
    },
    {
      pattern: /(bg|text|border)-BrutalAqua1/,
    },
    {
      pattern: /(bg|text|border)-BrutalPurple2/,
    },
    {
      pattern: /(bg|text|border)-BrutalGreen2/,
    },

    ,
    {
      pattern: /(bg|text|border)-BgSecondaryBrutalSkin1/,
    },
    
    
    {
      pattern: /(bg|text|border)-BrutalWhite/,

    },
    {
      pattern: /(bg|text|border)-fakeBlackNeu/,
    }
    
  ],
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
