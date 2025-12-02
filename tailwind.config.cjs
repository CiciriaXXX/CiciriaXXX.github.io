/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    // 确保扫描所有 src 目录下的 .js, .jsx, .ts, .tsx 文件
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

