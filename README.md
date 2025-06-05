# Tech_Compiler
Code editor created for community .
## Project Overview
This project is an advanced Code Editor and Compiler platform designed specifically for students to write, compile, and run code in multiple programming languages—all within a single, unified web application. It provides a seamless and interactive experience, empowering learners to experiment and practice coding in an efficient environment.

# Code Editor Compiler

A comprehensive web-based code editor and compiler that supports multiple programming languages in a single platform. This project provides students and developers with an integrated development environment (IDE) for writing, editing, and executing code across various programming languages.

The platform is built using modern web technologies including **React**, **Vite**, and **Tailwind CSS** to ensure a fast, responsive, and visually appealing user interface. It leverages an external compilation API service (requiring an API key) to compile and execute code securely in the cloud.`

## 🚀 Features

- **Multi-language Support**: Supports 40+ programming languages including:
  - JavaScript, TypeScript, Python, Java, C/C++
  - Go, Rust, Swift, Kotlin, Ruby, PHP
  - Assembly, Bash, Haskell, Scala, SQL, and many more
  - Compile and run code from a wide range of programming languages.

- **Monaco Editor Integration**: Professional code editing experience with:
  - Syntax highlighting
  - Auto-completion
  - Error detection
  - Dark theme interface
  - Minimap navigation
  - User-friendly, syntax-highlighted editor to write and edit code.
   
- **Real-time Code Execution**: Execute code directly in the browser with:
  - Live output display
  - Error handling and display
  - Execution status tracking
  - Base64 encoding for secure transmission

- **Responsive Design**: Modern, dark-themed UI built with Tailwind CSS
- **Keyboard Shortcuts**: Ctrl+Enter to run code quickly
- **Resizable Panels**: Adjustable editor and output panel sizes
- **Language Switching**: Easy language selection with version information
- **Code Snippets**: Access to a library of code snippets for common tasks
- **Cloud Compilation:** Code is sent to a secure API to compile and run, handling backend complexities.
- **Fast and Responsive UI:** Built using React with Vite and styled using Tailwind CSS for modern, responsive design.
- **API Key Based Access:** Secure access to the compilation API with a user-provided API key.


## 🛠️ Technologies Used

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.17
- **Code Editor**: Monaco Editor (@monaco-editor/react)
- **HTTP Client**: Axios 1.9.0
- **Code Execution API**: Judge0 CE via RapidAPI
- **Language**: JavaScript/JSX
- **Package Manager**: npm


## Prerequisites
- Node.js (version 14 or above)
- npm or yarn package manager
- API key for the code compilation service (you must register on the API provider's platform to obtain this)


## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Sign up for RapidAPI and subscribe to Judge0 CE
   - Replace the API key in `src/components/api.js`:
   ```javascript
   "X-RapidAPI-Key": "YOUR_API_KEY_HERE"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
code-editor/
├── public/
├── src/
│   ├── components/
│   │   ├── CompilerLandingPage.jsx    # Main editor component
│   │   ├── CodeEditorWindow.jsx       # Monaco editor wrapper
│   │   ├── LanguageSelector.jsx       # Language dropdown
│   │   ├── Output.jsx                 # Output display component
│   │   ├── api.js                     # API integration
│   │   └── constant.js                # Language configurations
│   ├── hooks/
│   │   └── keyPress.js                # Custom hook for keyboard shortcuts
│   ├── App.jsx                        # Root component
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🌐 API Integration

This project uses **Judge0 CE API** through RapidAPI for code execution:

- **Submission Endpoint**: Creates code execution jobs
- **Status Endpoint**: Checks execution status and retrieves results
- **Base64 Encoding**: Ensures secure code transmission
- **Polling Mechanism**: Handles asynchronous execution

### Supported Language IDs
- JavaScript (Node.js): 63
- Python 3: 71
- Java (OpenJDK): 62
- C++ (GCC): 54
- C (GCC): 50
- And 35+ more languages...

## 💡 Usage

1. **Select Language**: Choose from the dropdown menu (40+ languages available)
2. **Write Code**: Use the Monaco editor with syntax highlighting
3. **Execute Code**: Click "Run Code" or press Ctrl+Enter
4. **View Output**: Results appear in the bottom panel
5. **Resize Panels**: Drag the divider to adjust editor/output sizes
6. **Handle Errors**: Error messages are displayed with red highlighting

## 🎯 Key Components

### CompilerLandingPage.jsx
- Main container component
- Manages editor state and execution
- Handles resizing functionality
- Integrates all sub-components

### CodeEditorWindow.jsx
- Monaco editor wrapper
- Provides syntax highlighting
- Manages editor configuration
- Handles code snippets

### LanguageSelector.jsx
- Dropdown for language selection
- Displays language versions
- Updates editor configuration

### Output.jsx
- Displays execution results
- Handles error formatting
- Provides output scrolling
- Toggle visibility

### api.js
- Judge0 CE API integration
- Handles code submission
- Manages execution polling
- Error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically

## 🔐 Environment Variables

For production deployment, consider using environment variables for the API key:

```javascript
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "your-fallback-key";
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] File upload/download functionality
- [ ] User authentication and code saving
- [ ] Collaborative editing features
- [ ] Additional language support
- [ ] Custom themes and fonts
- [ ] Code sharing functionality
- [ ] Performance optimizations
- [ ] Mobile responsiveness improvements

## 🐛 Known Issues

- API rate limiting may occur with frequent requests
- Some languages may have longer execution times
- Large output may affect performance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**[ VISHAL & SHAILENDRA ]**
- GitHub: [@vishal6268],[Shailendrasingh189]
- Email: vchoudhary999v@gmail.com , shailendrasingh189@gmail.com
- LinkedIn: [https://www.linkedin.com/in/vishal-choudhary-1690202b7],[https://www.linkedin.com/in/shailendrasingh189].

## 🙏 Acknowledgments

- Judge0 CE for providing the code execution API
- Monaco Editor team for the excellent code editor
- React and Vite communities for the amazing tools
- Tailwind CSS for the utility-first CSS framework

---

**Note**: This is a graduation-level project demonstrating full-stack development skills, API integration, and modern web technologies. The platform serves as an educational tool for students learning multiple programming languages in a unified environment.