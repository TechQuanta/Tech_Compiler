// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CompilerLandingPage from "./pages/CompilerLandingPage";
import CodeEditor from "./pages/CodeEditor";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0f0a19] text-gray-500 overflow-hidden">
        <Routes>
          <Route path="/" element={<CompilerLandingPage />} />
          <Route path="/editor" element={<CodeEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
