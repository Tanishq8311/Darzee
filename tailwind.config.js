/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom luxury colors
        navy: {
          DEFAULT: "hsl(var(--navy))",
          light: "hsl(var(--navy-light))",
          dark: "hsl(220, 40%, 10%)",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          dark: "hsl(var(--gold-dark))",
          light: "hsl(45, 100%, 75%)",
        },
        silver: "hsl(var(--silver))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        'scissors-cut': 'scissorsCut 1.5s ease-in-out',
        'stitch': 'stitch 2s ease-in-out infinite',
        'weave': 'weave 4s ease-in-out infinite',
        'thread-spin': 'threadSpin 1s linear infinite',
        'sewing-needle': 'sewingNeedle 0.3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'measure-tape': 'measureTape 2s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'golden': '0 0 20px hsl(var(--gold) / 0.3)',
        'luxury': '0 10px 30px hsl(220, 30%, 5% / 0.3), 0 0 20px hsl(var(--gold) / 0.1)',
        'inner-golden': 'inset 0 1px 0 hsl(var(--gold) / 0.2)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(220, 30%, 14%) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--gold)) 50%, hsl(var(--primary)) 100%)',
        'fabric-texture': 'linear-gradient(45deg, transparent 25%, hsl(var(--gold) / 0.1) 25%, hsl(var(--gold) / 0.1) 50%, transparent 50%), linear-gradient(-45deg, transparent 25%, hsl(var(--gold) / 0.1) 25%, hsl(var(--gold) / 0.1) 50%, transparent 50%)',
      },
    },
  },
  plugins: [],
}