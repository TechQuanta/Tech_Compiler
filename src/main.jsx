// src/main.jsx (or src/App.jsx, depending on your setup)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming CodeEditor is your main component
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import './index.css'; // Your global Tailwind CSS file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* Wrap your entire application with ThemeProvider */}
      <App/>
    </ThemeProvider>
  </React.StrictMode>,
);