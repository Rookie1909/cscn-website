import { motion } from 'framer-motion';
import { useAgeVerification } from '@/contexts/AgeVerificationContext';

export function AgeVerificationModal() {
  const { isVerified, verify } = useAgeVerification();

  if (isVerified) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
      >
        {/* 18+ Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-8 border-red-600 flex items-center justify-center">
            <span className="text-6xl font-bold text-red-600">18+</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-2">
          Bist Du Alt Genug
        </h2>
        <h2 className="text-2xl font-bold text-black mb-6">
          Um Hier Zu Sein?
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={verify}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Ja, ich bin über 18 Jahre alt
          </button>
          <a
            href="https://google.com"
            className="px-8 py-3 text-green-500 hover:text-green-600 font-medium transition-colors"
          >
            Nein
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
