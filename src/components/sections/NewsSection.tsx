import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Image as ImageIcon, Newspaper, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';
import newsData from '@/data/news.json';

interface NewsItem {
  id: string;
  week: string;
  week_en?: string;
  month: string;
  month_en?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  content: string;
  content_en?: string;
  images: string[];
  date: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function NewsSection() {
  const { t, i18n } = useTranslation();
  const news = newsData as NewsItem[];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentLang = i18n.language;

  // Lock body scroll when an image is selected
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Handle Esc key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Newspaper size={14} />
            <span>{t('news.tag')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-headline font-black text-foreground mb-6">
            {t('news.headline')}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-border" />
            <CannabisLeaf size={24} className="text-primary" />
            <div className="h-px w-16 bg-border" />
          </div>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto text-lg leading-relaxed">
            {t('news.body')}
          </p>
        </motion.div>

        {/* Timeline Feed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative space-y-16 lg:space-y-24"
        >
          {/* Central Timeline Line (Hidden on small mobile) */}
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden sm:block" />

          {news.map((item, index) => {
            const week = currentLang === 'en' && item.week_en ? item.week_en : item.week;
            const month = currentLang === 'en' && item.month_en ? item.month_en : item.month;
            const title = currentLang === 'en' && item.title_en ? item.title_en : item.title;
            const description = currentLang === 'en' && item.description_en ? item.description_en : item.description;
            const content = currentLang === 'en' && item.content_en ? item.content_en : item.content;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
              >
                {/* Week Label - Large and striking */}
                <div className={`lg:flex flex-col ${index % 2 === 0 ? 'lg:items-end lg:text-right' : 'lg:order-2 lg:items-start lg:text-left'} hidden`}>
                  <div className="sticky top-32">
                    <span className="block text-6xl lg:text-8xl font-headline font-black text-primary/20 transition-colors group-hover:text-primary/30 leading-none">
                      {week}
                    </span>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                      <Calendar size={16} className="text-primary" />
                      <span className="font-sans font-bold text-foreground text-sm uppercase tracking-tight">
                        {month}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Week Label */}
                <div className="lg:hidden flex items-center gap-3 mb-2">
                  <span className="text-3xl font-headline font-black text-primary">
                    {week}
                  </span>
                  <span className="text-muted-foreground font-sans font-medium text-sm">
                    — {month}
                  </span>
                </div>

                {/* Content Card */}
                <div className={`${index % 2 === 0 ? '' : 'lg:order-1'}`}>
                  <div className="glass-card-premium group hover:border-primary/30 transition-all duration-500 overflow-hidden">
                    <div className="p-6 lg:p-8">
                      <h3 className="text-2xl lg:text-3xl font-headline font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-muted-foreground font-sans leading-relaxed mb-6">
                        {description}
                      </p>
                      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 mb-8">
                        <p className="text-foreground/80 font-sans italic text-sm leading-loose">
                          "{content}"
                        </p>
                      </div>

                      {/* Image Collage Grid */}
                      <div className={`grid gap-3 ${item.images.length === 1 ? 'grid-cols-1' : item.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                        {item.images.map((img, imgIndex) => (
                          <div 
                            key={imgIndex} 
                            className={`relative rounded-xl overflow-hidden shadow-md aspect-video cursor-zoom-in group/img ${
                              item.images.length === 3 && imgIndex === 2 ? 'col-span-2' : ''
                            }`}
                            onClick={() => setSelectedImage(img)}
                          >
                            <img 
                              src={img} 
                              alt={`${title} view ${imgIndex + 1}`}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-bold uppercase tracking-widest">
                          <ImageIcon size={14} />
                          <span>{item.images.length} {t('news.impressions')}</span>
                        </div>
                        <button className="flex items-center gap-2 text-primary font-bold text-sm group/btn">
                          <span>{t('news.read_more')}</span>
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-0 lg:left-1/2 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)] hidden sm:block" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground font-sans text-sm">
            {t('news.footer_text')} <br className="sm:hidden" />
            &nbsp;<a href="#newsletter" className="text-primary font-bold hover:underline">{t('news.newsletter')}</a>.
          </p>
        </motion.div>
      </div>

      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 shadow-lg hover:rotate-90 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group/modal w-full h-full flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="News highlight" 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
                />
                
                {/* Decorative corner glow */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
