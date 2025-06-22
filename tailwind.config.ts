export default {
  theme: {
    extend: {
      animation: {
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in': 'slideIn 0.8s ease-in-out',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
}
