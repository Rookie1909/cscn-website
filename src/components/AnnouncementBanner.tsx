import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AnnouncementBannerProps {
  text: string;
  link: string;
}

export function AnnouncementBanner({ text, link }: AnnouncementBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-r from-green-600 to-green-500 py-3"
    >
      <Link to={link} className="block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <motion.span
            animate={{ x: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </motion.span>
          <span className="text-white font-semibold text-sm sm:text-base text-center">
            {text}
          </span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}
