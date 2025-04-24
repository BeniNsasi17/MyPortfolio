import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    // Add hover listeners to interactive elements
    const handleLinkHoverEvents = () => {
      const links = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      
      links.forEach((link) => {
        link.addEventListener('mouseenter', () => setCursorVariant('hover'));
        link.addEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };

    // Initial setup and periodic check for new elements
    handleLinkHoverEvents();
    const intervalId = setInterval(handleLinkHoverEvents, 2000);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      clearInterval(intervalId);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      opacity: 1,
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      backgroundColor: 'rgba(59, 110, 176, 0.1)',
      mixBlendMode: 'normal',
      border: '2px solid #3B6EB0',
    },
  };

  // Only render on non-touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main circular cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-primary z-50 pointer-events-none"
        style={{ opacity: 0.7 }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
          mass: 0.5,
        }}
      />
      
      {/* Small dot in center */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary z-50 pointer-events-none"
        style={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 400,
        }}
      />
    </>
  );
};

export default AnimatedCursor; 