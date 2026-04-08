import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export function ClubInfoSection() {
  const { t } = useTranslation();
  const features = t('home.club_info.features', { returnObjects: true }) as string[];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Link to="/verein" className="block group">
              <div className="relative rounded-2xl overflow-hidden border border-border group-hover:border-primary/50 transition-all duration-500 shadow-lg">
                <img
                  src="/images/cannabis-plant.jpg"
                  alt={t('home.club_info.image_alt')}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                {/* CSCN Watermark */}
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-primary/40 text-4xl font-headline font-black tracking-tighter">{t('home.club_info.watermark')}</p>
                  <p className="text-foreground text-sm mt-1 font-medium font-sans">
                    {t('home.club_info.watermark_sub')}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground">
              {t('home.club_info.title')}
            </h2>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground font-sans text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-muted-foreground font-sans leading-relaxed">
              {t('home.club_info.description')}
            </p>

            <Link
              to="/verein"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold font-sans group transition-colors"
            >
              {t('home.club_info.more_link')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
