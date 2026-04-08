import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export function SafetySection() {
  const { t } = useTranslation();
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
                {t('home.safety.title')}
              </h2>
              <p className="text-primary font-medium text-xl">{t('home.safety.subtitle')}</p>
            </div>

            <p className="text-muted-foreground font-sans leading-relaxed">
              {t('home.safety.description')}
            </p>

            <div className="p-6 bg-muted border border-border rounded-xl">
              <p className="text-muted-foreground text-sm font-sans leading-relaxed italic">
                {t('home.safety.warning')}
              </p>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/gesundheitsschutz" className="block group">
              <div className="p-8 border border-border rounded-2xl hover:border-primary/50 transition-all duration-500 bg-card hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-foreground">
                      {t('home.safety.card_title')}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold font-sans">
                  <span className="text-sm">{t('home.safety.more_link')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
