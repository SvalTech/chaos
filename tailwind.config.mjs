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
                    50: 'rgb(var(--brand-50) / <alpha-value>)',
                    100: 'rgb(var(--brand-100) / <alpha-value>)',
                    200: 'rgb(var(--brand-200) / <alpha-value>)',
                    300: 'rgb(var(--brand-300) / <alpha-value>)',
                    400: 'rgb(var(--brand-400) / <alpha-value>)',
                    500: 'rgb(var(--brand-500) / <alpha-value>)',
                    600: 'rgb(var(--brand-600) / <alpha-value>)',
                    700: 'rgb(var(--brand-700) / <alpha-value>)',
                    800: 'rgb(var(--brand-800) / <alpha-value>)',
                    900: 'rgb(var(--brand-900) / <alpha-value>)',
                }
            },
            height: { screen: '100dvh' },
            animation: {
                // ... keep your existing animations ...
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
                // ... keep your existing keyframes ...
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                bounceSlight: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
                scaleIn: { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUpFade: { '0%': { transform: 'translateY(15px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                slideRightFade: { '0%': { transform: 'translateX(-15px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } }
            },
            boxShadow: {
                // Updated glow shadows to use the dynamic brand color
                'soft': '0 4px 40px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 30px rgb(var(--brand-600) / 0.3)',
                'glow-sm': '0 0 15px rgb(var(--brand-600) / 0.2)',
                'floating': '0 20px 40px -10px rgba(0,0,0,0.1)',
                'floating-dark': '0 20px 40px -10px rgba(0,0,0,0.5)',
                'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
                'inner-dark': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            },
        }
    }
}