import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#000000', // GALLERY.bg — fond noir pur
        ink: '#f4f4f2',   // texte (clair sur fond noir)
      },
      fontFamily: {
        // une seule police : Helvetica (fallbacks système)
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        wider2: '0.12em', // capitales légèrement espacées (signature typo)
      },
    },
  },
  plugins: [],
};

export default config;
