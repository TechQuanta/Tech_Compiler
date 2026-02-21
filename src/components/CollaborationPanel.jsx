import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiX, FiActivity, FiUserPlus, FiCircle } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const CollaborationPanel = ({ 
  isOpen, 
  onClose, 
  isSessionActive, 
  sessionId, 
  participants, 
  onStartSession, 
  onEndSession,
  onJoinSession
}) => {
  const { theme } = useTheme();
  const [joinInput, setJoinInput] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Invite link copied to clipboard!");
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
                    onClick={onStartSession}
                    className="w-full py-2.5 rounded-lg font-medium text-sm text-white shadow-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                >
                    Start New Session
                </button>

                <div className="w-full pt-4 border-t border-gray-200 dark:border-[#333]">
                  <p className="text-sm text-gray-500 mb-2">Or join existing:</p>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Session ID" 
                      value={joinInput}
                      onChange={(e) => setJoinInput(e.target.value)}
                      className={`w-full px-3 py-2 rounded text-sm ${
                        theme === 'dark'
                          ? 'bg-[#252525] text-white border-[#444]'
                          : 'bg-gray-100 border-gray-300'
                      } border`}
                    />

                    <button 
                      onClick={() => onJoinSession(joinInput)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg border ${
                  theme === "dark"
                    ? "bg-[#252525] border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Session ID
                    </label>

                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xl font-bold tracking-widest text-blue-500">
                          {sessionId}
                        </span>

                        <span className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                            Live
                        </span>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Active Users ({participants.length || 1})
                        </label>

                        <button
                          onClick={handleCopyLink}
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                            <FiUserPlus size={12}/> Copy Invite Link
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {participants.length > 0 ? participants.map((user, i) => (
                           <div key={i} className={`flex items-center gap-3 p-2 rounded-md ${
                             theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"
                           }`}>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                                  {user.name.substring(0, 2).toUpperCase()}
                              </div>

                              <div className="flex-1">
                                  <p className="text-sm font-medium leading-none">
                                    {user.name}
                                  </p>
                              </div>

                              <FiCircle size={8} className="text-green-500 fill-current" />
                          </div>
                        )) : (
                          <>
                            <div className="flex items-center gap-3 p-2 rounded-md opacity-50">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                    +
                                </div>
                                <p className="text-sm text-gray-500 italic">
                                  Waiting for others...
                                </p>
                            </div>
                          </>
                        )}
                    </div>
                </div>

                <button 
                    onClick={onEndSession}
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
