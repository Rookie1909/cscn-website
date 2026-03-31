import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeroProps {
  title: string;
  description?: string;
  backgroundImage?: string;
  cta?: {
    text: string;
    link: string;
  };
  banner?: {
    text: string;
    link: string;
  };
}

export function PageHero({
  title,
  description,
  backgroundImage,
  cta,
  banner,
}: PageHeroProps) {
  return (
    <section className="relative">
      {/* Banner */}
      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary py-3"
        >
          <Link to={banner.link} className="block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <span className="text-primary-foreground font-headline font-bold text-sm sm:text-base tracking-wide">
                {banner.text}
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Hero Content */}
      <div
        className={`relative py-20 lg:py-32 ${
          backgroundImage ? 'overflow-hidden' : ''
        }`}
      >
        {backgroundImage && (
          <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-6xl font-headline font-black text-foreground mb-4 tracking-tight">
                {title}
              </h1>
            </motion.div>

            {description && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-muted-foreground font-sans text-xl leading-relaxed max-w-2xl">{description}</p>
              </motion.div>
            )}
          </div>

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex justify-center"
            >
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold shadow-lg shadow-primary/10 transition-all active:scale-95 px-8 h-14"
              >
                <Link to={cta.link} className="flex items-center gap-2">
                  {cta.text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
