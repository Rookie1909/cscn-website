import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FlaskConical, Sprout } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function MotivationSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: FlaskConical,
      title: t('home.motivation.features.quality.title'),
      subtitle: t('home.motivation.features.quality.subtitle'),
      description: t('home.motivation.features.quality.text'),
    },
    {
      icon: CannabisLeaf,
      title: t('home.motivation.features.variety.title'),
      subtitle: t('home.motivation.features.variety.subtitle'),
      description: t('home.motivation.features.variety.text'),
    },
    {
      icon: Sprout,
      title: t('home.motivation.features.organic.title'),
      subtitle: t('home.motivation.features.organic.subtitle'),
      description: t('home.motivation.features.organic.text'),
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-headline font-bold text-foreground mb-2">
            {t('home.motivation.title')}
          </h2>
          <p className="text-primary font-medium text-lg">{t('home.motivation.subtitle')}</p>
        </motion.div>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-muted-foreground font-sans text-center max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {t('home.motivation.description')}
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-8 border border-border rounded-2xl flex flex-col items-center text-center hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-headline font-semibold text-lg">{feature.title}</h3>
                  <p className="text-primary text-sm font-medium">{feature.subtitle}</p>
                </div>
              </div>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
