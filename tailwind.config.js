/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Luckiest Guy"', 'cursive'], // เพิ่มฟอนต์
          },
          backgroundImage: {
            'pop-bg': "url('https://i.pinimg.com/originals/c9/16/51/c9165186bddc0e6bd71d45cb720bb2c7.gif')",
          },
          keyframes: {
            popBackground: {
              '0%, 100%': { backgroundSize: '100%' },
              '50%': { backgroundSize: '150%' },
            },
          },
          animation: {
            popBackground: 'popBackground 2s infinite',
          },
        },
      },
      plugins: [],
    };
    
