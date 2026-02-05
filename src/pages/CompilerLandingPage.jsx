import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const CompilerLandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    navigate('/editor');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center ${
      theme === 'dark' ? 'bg-[#0f0a19] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          🚀 Tech_<span className="text-blue-500">Compiler</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-medium">
          Advanced web-based Code Editor and Compiler for the community.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Start Coding Now
          </button>
          <a
            href="https://github.com/TechQuanta/Tech_Compiler/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-all"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl">
        <div className="p-6 rounded-xl border border-gray-800 bg-opacity-50 bg-gray-900">
          <h3 className="text-xl font-bold mb-2">🌍 40+ Languages</h3>
          <p className="text-gray-400">Support for Python, Java, C++, JavaScript, Rust, and many more.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-opacity-50 bg-gray-900">
          <h3 className="text-xl font-bold mb-2">✨ Monaco Editor</h3>
          <p className="text-gray-400">Modern IDE experience with syntax highlighting and auto-completion.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-800 bg-opacity-50 bg-gray-900">
          <h3 className="text-xl font-bold mb-2">⚡ Real-Time Execution</h3>
          <p className="text-gray-400">Instant compilation and runtime feedback using secure cloud APIs.</p>
        </div>
      </div>

      <div className="mt-20 opacity-70">
        <p className="text-sm">Official Open Source Project under</p>
        <p className="font-bold text-blue-400">DSC Winter of Code 2026</p>
      </div>
    </div>
  );
};

export default CompilerLandingPage;