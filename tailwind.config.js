/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      // Kustomisasi tema Tailwind MURNI Anda (jika ada)
    },
  },
  // Array 'plugins' KOSONG karena daisyUI dimuat via @plugin
  plugins: [],

  // Konfigurasi daisyUI (termasuk tema) TETAP di sini
  daisyui: {
    themes: ['dracula'], // Tema yang ingin Anda gunakan
    // Opsi konfigurasi daisyUI lainnya bisa ditambahkan di sini
  },
};
