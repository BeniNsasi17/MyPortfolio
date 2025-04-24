import { motion } from 'framer-motion';

interface LoaderProps {
  isLoading: boolean;
  onLoadingComplete: () => void;
}

const Loader = ({ isLoading, onLoadingComplete }: LoaderProps) => {
  return (
    <motion.div
      className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden ${
        isLoading ? 'block' : 'hidden'
      }`}
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1], delay: 2 }}
      onAnimationComplete={onLoadingComplete}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0.8, 1] }}
          transition={{ duration: 1.5, times: [0, 0.4, 0.7, 1] }}
          className="w-32 h-32 mb-8 flex items-center justify-center"
        >
          <div className="relative w-20 h-20">
            <motion.div
              className="absolute w-full h-full rounded-full bg-primary-light"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 1.5, times: [0, 0.7, 1], delay: 0.2 }}
            />
            <motion.div
              className="absolute w-full h-full rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1] }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div
              className="absolute inset-3 rounded-full bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1] }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </div>
        </motion.div>
        
        <motion.h1
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Portfolio
        </motion.h1>
        
        <motion.div 
          className="mt-8 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {[0, 1, 2].map(index => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loader;

 