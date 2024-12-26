import { useState, useEffect } from "react";

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
};