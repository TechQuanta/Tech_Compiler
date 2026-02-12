import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCopy, FiCheck, FiLink, FiTwitter, FiFacebook } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ShareModal = ({ isOpen, onClose, code }) => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (isOpen && code) {
      const encoded = btoa(unescape(encodeURIComponent(code)));
      const url = `${window.location.origin}/editor?code=${encoded}`;
      setShareUrl(url);
    }
  }, [isOpen, code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform) => {
    const text = "Check out my code on Tech Compiler!";
    let url = "";
    if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === "facebook") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden
              ${theme === "dark" ? "bg-[#1e1e1e] text-white border border-gray-700" : "bg-white text-gray-900"}`}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b 
              ${theme === "dark" ? "border-gray-700 bg-[#252525]" : "border-gray-100 bg-gray-50"}`}>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiLink className="text-blue-500" />
                Share Code
              </h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Shareable Link</label>
                <div className={`flex items-center gap-2 p-2 rounded-lg border 
                  ${theme === "dark" ? "bg-black/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-500 truncate font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                      ${copied 
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"}`}
                  >
                    {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium uppercase tracking-wider text-gray-500">Social Share</label>
                 <div className="flex gap-3">
                    <button 
                      onClick={() => shareToSocial("twitter")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all hover:scale-[1.02]
                      ${theme === "dark" ? "border-gray-700 hover:bg-[#2d2d2d]" : "border-gray-200 hover:bg-gray-50"}`}>
                      <FiTwitter className="text-[#1DA1F2]" size={18} />
                      <span className="text-sm font-medium">Twitter</span>
                    </button>
                    <button 
                       onClick={() => shareToSocial("facebook")}
                       className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all hover:scale-[1.02]
                      ${theme === "dark" ? "border-gray-700 hover:bg-[#2d2d2d]" : "border-gray-200 hover:bg-gray-50"}`}>
                      <FiFacebook className="text-[#4267B2]" size={18} />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                 </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;