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
                    50: '#E6F7F4',
                    100: '#CCEFE9',
                    200: '#99DFD3',
                    300: '#66CFBD',
                    400: '#33BFA7',
                    500: '#00A884',
                    600: '#008A6D',
                    700: '#006B56',
                    800: '#004D3F',
                    900: '#002E28',
                },
                secondary: {
                    50: '#E6F2F1',
                    100: '#CCE5E3',
                    200: '#99CBC7',
                    300: '#66B1AB',
                    400: '#33978F',
                    500: '#128C7E',
                    600: '#0E7065',
                    700: '#0B544C',
                    800: '#073833',
                    900: '#041C1A',
                },
            },
            boxShadow: {
                soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
                hard: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                glow: '0 0 20px rgba(0, 168, 132, 0.3)',
            },
        },
    },
    plugins: [],
}
