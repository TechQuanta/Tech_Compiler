// tailwind.config.js
export default {
  darkMode: 'class', // <--- IMPORTANT: This enables class-based dark mode
  content: [ // <--- This 'content' array needs to be at the top level
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-background-primary': '#FFFFFF', // Assuming a light theme equivalent
        'light-background-secondary': '#F0F0F0', // Assuming a light theme equivalent
        'light-border-primary': '#D1D5DB', // Assuming a light theme equivalent
        'light-text-primary': '#374151', // Assuming a light theme equivalent
        'light-text-secondary': '#6B7280', // Assuming a light theme equivalent
        'light-input-bg': '#E5E7EB', // Assuming a light theme equivalent
        'light-accent-blue': '#00BFFF', // Use your accent blue for light theme active/focus
        'light-accent-green': '#2ECC71', // Use your accent green for light theme
        'light-accent-purple': '#8E44AD', // Use your hover purple for light theme
        'light-accent-pink': '#EC4899', // A generic pink for close, adjust as needed

        'dark-background-primary': '#121212', // Matte Black Base
        'dark-background-secondary': '#1E1E1E', // Slightly lighter for secondary background
        'dark-border-primary': '#374151', // Darker border for contrast
        'dark-text-primary': '#F8F8FF', // Primary Text (Ghost White)
        'dark-text-secondary': '#B0BEC5', // Muted Text (Blue Grey)
        'dark-input-bg': '#2C2C2C', // Darker input background
        'dark-accent-blue': '#00BFFF', // Electric Blue
        'dark-accent-green': '#2ECC71', // Secondary Highlights
        'dark-accent-purple': '#8E44AD', // Cyber Purple (for hover/buttons)
        'dark-accent-pink': '#EC4899', // A generic pink for close, adjust as needed
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        code: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};