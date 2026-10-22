import React, { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "ur", name: "Urdu (اردو)" },
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode, langName) => {
    setCurrentLang(langName);
    setIsOpen(false);

    // Find the hidden Google Translate select element
    const selectField = document.querySelector(".goog-te-combo");
    if (selectField) {
      selectField.value = langCode;
      selectField.dispatchEvent(new Event("change"));
    } else {
      // Retry in case widget hasn't loaded fully
      setTimeout(() => {
        const retrySelect = document.querySelector(".goog-te-combo");
        if (retrySelect) {
          retrySelect.value = langCode;
          retrySelect.dispatchEvent(new Event("change"));
        }
      }, 1000);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 dark:text-slate-300 transition-colors font-medium text-sm border border-transparent dark:border-slate-700 shadow-sm"
      >
        <Globe size={18} className="text-indigo-500 dark:text-indigo-400" />
        <span className="hidden lg:inline-block w-16 text-left truncate">
          {currentLang}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 max-h-[300px] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-[100] overflow-hidden"
          >
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    changeLanguage(lang.code, lang.name.split(" ")[0])
                  }
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
