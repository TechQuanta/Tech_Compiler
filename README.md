<div align=center>
  
  <img alt="Tech_Compiler – Data Science Club" src="https://media.licdn.com/dms/image/v2/C4E22AQG47_CrAjrEBg/feedshare-shrink_800/feedshare-shrink_800/0/1645878629215?e=2147483647&t=zNxl5EEgTceK2X0XdLKTKwfFitE00GCuSwmSKT7FQRk&v=beta" height=300 width=1000 />
</div>

# 🚀 Tech_Compiler
**Code Editor created for the community**

---

## 🌍 Open Source Program Association

### 🏆 Hosted in DSC Winter of Code (DSC WoC) 2026

🎉 **Tech_Compiler** is proudly hosted as an **official open-source project under _DSC Winter of Code (DSC WoC) 2026_**.

DSC WoC is a large-scale open-source initiative by **Google Developer Student Clubs (DSC)** that promotes open-source culture, mentorship, and real-world collaborative development.

---

## 🧠 Project Overview

**Tech_Compiler** is an advanced **web-based Code Editor and Compiler platform** designed for students and developers to **write, compile, and run code in 40+ programming languages**—all within a single, unified web application.

It delivers a fast, interactive, and modern IDE-like experience without the need for local compiler setup.

---

## 💻 Code Editor & Compiler

A comprehensive **online IDE** that enables seamless coding, compiling, and execution directly in the browser using secure cloud-based APIs.

Built with:
- ⚛️ React  
- ⚡ Vite  
- 🎨 Tailwind CSS  

---

## 🚀 Features

### 🌍 Multi-Language Support
- JavaScript, TypeScript, Python, Java, C/C++
- Go, Rust, Swift, Kotlin, Ruby, PHP
- Bash, SQL, Scala, Haskell, Assembly, and more

### ✨ Monaco Editor Integration
- Syntax highlighting  
- Auto-completion  
- Error detection  
- Dark theme interface  
- Minimap navigation  

### ⚡ Real-Time Code Execution
- Live output display  
- Compilation & runtime error handling  
- Execution status tracking  
- Secure Base64 encoded transmission  

### 🎯 Productivity Enhancements
- ⌨️ Ctrl + Enter to run code  
- 📐 Resizable editor & output panels  
- 🌐 Language switching with version info  
- 📦 Built-in code snippets  
- 🔐 API-key based secure execution  

---

## 🛠️ Technologies Used

| Category | Technology |
|--------|-----------|
| Frontend | React 19.1.0 |
| Build Tool | Vite 6.3.5 |
| Styling | Tailwind CSS 3.4.17 |
| Code Editor | Monaco Editor |
| HTTP Client | Axios 1.9.0 |
| Code Execution | Judge0 CE (RapidAPI) |
| Language | JavaScript / JSX |
| Package Manager | npm |

---

## 📋 Prerequisites

- Node.js (v14 or above)
- npm or yarn
- RapidAPI Judge0 CE API Key

---

## 📦 Installation

1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd tech_compiler
```
2️⃣ Install Dependencies
npm install

3️⃣ Configure API Key
"X-RapidAPI-Key": "YOUR_API_KEY_HERE"

4️⃣ Start Development Server
npm run dev

5️⃣ Open in Browser
http://localhost:5173


🏗️ Project Structure

```dir
code-editor/
├── public/
├── src/
│   ├── components/
│   │   ├── CompilerLandingPage.jsx
│   │   ├── CodeEditorWindow.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── Output.jsx
│   │   ├── api.js
│   │   └── constant.js
│   ├── hooks/
│   │   └── keyPress.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

# 🤝 Contributing

*Tech_Compiler actively welcomes contributions, especially from DSC WoC 2026 participants 🎉*

- Fork the repository

- Create a feature branch

- Commit your changes
