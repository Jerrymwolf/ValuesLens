import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#E6F4F9',
          100: '#CCE9F3',
          200: '#99D3E7',
          300: '#66BDDB',
          400: '#33A7CF',
          500: '#0279AF',
          600: '#0268A0',
          700: '#015E8C',
          800: '#004466',
          900: '#002233',
        },
        accent: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#AFFC40',
          500: '#8FD932',
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
        },
      },
    },
  },
  plugins: [],
};
export default config;
