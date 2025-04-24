import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fonction pour vérifier et appliquer le thème
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDarkMode(dark);
    
    // Forcer le recalcul CSS
    const currentTheme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = currentTheme;
    
    // Forcer un reflow (peut aider à déclencher l'application des nouveaux styles)
    void document.documentElement.offsetHeight;
  };

  // Effet d'initialisation pour vérifier les préférences
  useEffect(() => {
    // Vérifier d'abord le localStorage
    const storedTheme = localStorage.getItem('darkMode');
    
    if (storedTheme === 'true') {
      applyTheme(true);
    } else if (storedTheme === 'false') {
      applyTheme(false);
    } else {
      // Si pas de préférence stockée, vérifier les préférences système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
      localStorage.setItem('darkMode', prefersDark ? 'true' : 'false');
    }

    // Ajouter un écouteur pour les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Ne pas changer si l'utilisateur a explicitement défini une préférence
      if (!localStorage.getItem('darkMode')) {
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle du thème
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    applyTheme(newMode);
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
    
    // Dispatch un événement personnalisé pour informer d'autres composants
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDarkMode: newMode } 
    }));
    
    console.log(`Theme changed to ${newMode ? 'dark' : 'light'} mode`);
  };

  return (
    <motion.button
      className="fixed z-40 top-24 right-4 md:right-6 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 