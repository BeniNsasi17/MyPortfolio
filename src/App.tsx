import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import Loader from './components/Loader'
import AnimatedCursor from './components/AnimatedCursor'

function App() {
  const [loading, setLoading] = useState(true)
  const [contentLoaded, setContentLoaded] = useState(false)

  useEffect(() => {
    // Vérifier si le thème sombre est appliqué
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      console.log('Dark mode active:', isDarkMode);
    };

    // Vérification initiale
    checkDarkMode();

    // Observer les changements de classe sur html
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Simulate content loading
    const timer = setTimeout(() => {
      setContentLoaded(true)
    }, 500)

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    }
  }, [])

  const handleLoadingComplete = () => {
    // This will be called when the loader animation completes
    setLoading(false)
  }

  return (
    <>
      <AnimatedCursor />
      <Loader isLoading={contentLoaded} onLoadingComplete={handleLoadingComplete} />
      {/* Render content immediately but keep it hidden with CSS until loading completes */}
      <div className={loading && contentLoaded ? 'invisible' : 'visible'}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </div>
    </>
  )
}

export default App
