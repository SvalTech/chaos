/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.js",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
                    500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065',
                }
            },
            height: { screen: '100dvh' },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'bounce-slight': 'bounceSlight 1.5s ease-in-out infinite',
                'spin-slow': 'spin 4s linear infinite',
                'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up-fade': 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'slide-right-fade': 'slideRightFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                bounceSlight: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
                scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUpFade: { '0%': { transform: 'translateY(15px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                slideRightFade: { '0%': { transform: 'translateX(-15px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } }
            },
            boxShadow: {
                'soft': '0 4px 40px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 30px rgba(124, 58, 237, 0.3)',
                'glow-sm': '0 0 15px rgba(124, 58, 237, 0.2)',
                'floating': '0 20px 40px -10px rgba(0,0,0,0.1)',
                'floating-dark': '0 20px 40px -10px rgba(0,0,0,0.5)',
                'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
                'inner-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            },
        }
    }
}