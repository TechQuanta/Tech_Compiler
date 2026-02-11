import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiX, FiActivity, FiUserPlus, FiCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const CollaborationPanel = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const startSession = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setSessionId(Math.random().toString(36).substring(2, 8).toUpperCase());
      setIsSessionActive(true);
      setIsConnecting(false);
    }, 1500);
  };

  const endSession = () => {
    setIsSessionActive(false);
    setSessionId("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`absolute top-0 right-0 h-full w-80 z-40 border-l shadow-2xl flex flex-col
            ${theme === "dark" ? "bg-[#1e1e1e] border-[#333] text-white" : "bg-white border-gray-200 text-gray-900"}`}
        >
          <div className={`flex items-center justify-between px-5 py-4 border-b
             ${theme === "dark" ? "border-[#333]" : "border-gray-200"}`}>
            <h2 className="font-semibold flex items-center gap-2">
              <FiUsers className="text-green-500" />
              Collaboration
            </h2>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {!isSessionActive ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
                <div className={`p-4 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                    <FiActivity size={32} className="text-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Live Coding Session</h3>
                    <p className="text-sm text-gray-500 px-4">
                        Start a session to code with others in real-time.
                    </p>
                </div>
                <button
                    onClick={startSession}
                    disabled={isConnecting}
                    className={`w-full py-2.5 rounded-lg font-medium text-sm text-white shadow-lg transition-all active:scale-95
                        ${isConnecting 
                            ? "bg-gray-500 cursor-wait" 
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"}`}
                >
                    {isConnecting ? "Establishing Connection..." : "Start New Session"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Session ID</label>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xl font-bold tracking-widest text-blue-500">{sessionId}</span>
                        <span className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                            Live
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Users (1)</label>
                        <button className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            <FiUserPlus size={12}/> Invite
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        <div className={`flex items-center gap-3 p-2 rounded-md ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                                YO
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium leading-none">You</p>
                                <p className="text-xs text-gray-500 mt-1">Host • Writing code...</p>
                            </div>
                            <FiCircle size={8} className="text-green-500 fill-current" />
                        </div>
                        <div className={`flex items-center gap-3 p-2 rounded-md opacity-50`}>
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                +
                            </div>
                            <p className="text-sm text-gray-500 italic">Waiting for others...</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={endSession}
                    className="w-full mt-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors"
                >
                    End Session
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollaborationPanel;